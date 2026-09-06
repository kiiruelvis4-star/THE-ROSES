/**
 * SQLite & Expo-SQLite Database Module for Little Roses EduHub
 * 
 * Provides bulk learner insertion, table initialization, and cross-platform
 * execution for both Expo SQLite (mobile runtime) and Web Offline Storage.
 */

import { storage } from './storageService';
import { Student, TimetableSlot } from '../types';

export interface LearnerInput {
  name: string;
  grade: string;
  gender: string;
  admissionNumber?: string;
  parentName?: string;
  parentPhone?: string;
}

/**
 * Expo-SQLite interface definition for mobile / native environments
 */
export interface SQLiteTransaction {
  executeSql(
    sqlStatement: string,
    args?: any[],
    success?: (tx: SQLiteTransaction, resultSet: any) => void,
    error?: (tx: SQLiteTransaction, error: any) => boolean | void
  ): void;
}

export interface SQLiteDatabase {
  transaction(
    callback: (tx: SQLiteTransaction) => void,
    error?: (error: any) => void,
    success?: () => void
  ): void;
}

let activeDbInstance: SQLiteDatabase | null = null;

export const setDatabase = (database: SQLiteDatabase): void => {
  activeDbInstance = database;
};

export const getDatabase = (): SQLiteDatabase | null => {
  return activeDbInstance;
};

/**
 * SQLite Schema Initialization Scripts
 */
export const SQLITE_LEARNERS_SCHEMA = `
CREATE TABLE IF NOT EXISTS learners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  gender TEXT NOT NULL,
  admission_number TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

export const SQLITE_TIMETABLE_SCHEMA = `
CREATE TABLE IF NOT EXISTS timetable (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day TEXT,
  time_slot TEXT,
  subject TEXT,
  grade TEXT
);
`;

/**
 * Initialize Timetable Schema
 * Matches Expo-SQLite transaction pattern:
 * db.transaction(tx => { tx.executeSql(`CREATE TABLE IF NOT EXISTS timetable ...`); });
 */
export const initTimetable = (customDb?: SQLiteDatabase): Promise<void> => {
  const targetDb = customDb || activeDbInstance;
  return new Promise((resolve, reject) => {
    if (targetDb && typeof targetDb.transaction === 'function') {
      try {
        targetDb.transaction(
          (tx: SQLiteTransaction) => {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS timetable (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                day TEXT,
                time_slot TEXT,
                subject TEXT,
                grade TEXT
              );`
            );
          },
          (error: any) => reject(error),
          () => resolve()
        );
        return;
      } catch (err) {
        console.warn('SQLite initTimetable transaction error:', err);
      }
    }
    // Web / local storage initialization: ensures timetable data exists
    storage.getTimetable();
    resolve();
  });
};

/**
 * Admin function to update any timetable slot
 * Matches Expo-SQLite update pattern:
 * UPDATE timetable SET subject = ?, time_slot = ? WHERE id = ?;
 * 
 * @param id The timetable slot ID
 * @param newSubject Updated subject name
 * @param newTimeSlot Updated time slot period string
 * @param customDb Optional expo-sqlite database instance
 */
export const updateTimetableSlot = (
  id: string | number,
  newSubject: string,
  newTimeSlot: string,
  customDb?: SQLiteDatabase
): Promise<any> => {
  const targetDb = customDb || activeDbInstance;
  return new Promise((resolve, reject) => {
    if (targetDb && typeof targetDb.transaction === 'function') {
      try {
        targetDb.transaction(
          (tx: SQLiteTransaction) => {
            tx.executeSql(
              'UPDATE timetable SET subject = ?, time_slot = ? WHERE id = ?;',
              [newSubject, newTimeSlot, id],
              (_: SQLiteTransaction, result: any) => {
                // Also synchronize web storage so UI updates reactively
                storage.updateTimetableSlot(id, newSubject, newTimeSlot);
                resolve(result);
              },
              (_: SQLiteTransaction, error: any) => {
                reject(error);
                return true;
              }
            );
          },
          (error: any) => reject(error)
        );
        return;
      } catch (err) {
        console.warn('SQLite updateTimetableSlot error, falling back to storage:', err);
      }
    }

    // Web & Standalone PWA environment: Synchronize via EduHub Storage Engine
    try {
      const updated = storage.updateTimetableSlot(id, newSubject, newTimeSlot);
      resolve({
        rowsAffected: updated ? 1 : 0,
        insertId: id,
        message: updated 
          ? `Timetable slot #${id} successfully updated to ${newSubject} (${newTimeSlot})` 
          : `Slot #${id} saved`
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Delete a single learner by ID from SQLite database and local storage
 */
export const deleteLearner = (
  id: string | number,
  customDb?: SQLiteDatabase
): Promise<any> => {
  const targetDb = customDb || getDatabase();
  const idStr = String(id).trim();
  return new Promise((resolve, reject) => {
    if (targetDb && typeof targetDb.transaction === 'function') {
      try {
        targetDb.transaction(
          (tx: SQLiteTransaction) => {
            tx.executeSql(
              'DELETE FROM learners WHERE id = ?;',
              [id],
              (_: SQLiteTransaction, result: any) => {
                storage.deleteStudent(idStr);
                resolve(result);
              },
              (_: SQLiteTransaction, error: any) => {
                reject(error);
                return true;
              }
            );
          },
          (err: any) => reject(err)
        );
        return;
      } catch (e) {
        console.warn('SQLite deleteLearner error, using storage fallback:', e);
      }
    }
    const remaining = storage.deleteStudent(idStr);
    resolve({ rowsAffected: 1, id: idStr, remainingCount: remaining.length });
  });
};

/**
 * Update a learner in SQLite database and EduHub offline storage
 */
export const updateLearner = (
  updatedStudent: Student,
  customDb?: SQLiteDatabase
): Promise<any> => {
  const targetDb = customDb || getDatabase();
  return new Promise((resolve) => {
    if (targetDb && typeof targetDb.transaction === 'function') {
      try {
        targetDb.transaction(
          (tx: SQLiteTransaction) => {
            tx.executeSql(
              'UPDATE learners SET name = ?, grade = ?, gender = ? WHERE id = ?;',
              [updatedStudent.name, updatedStudent.grade, updatedStudent.gender, updatedStudent.id],
              (_: SQLiteTransaction, result: any) => {
                storage.saveStudent(updatedStudent);
                resolve(result);
              },
              () => {
                storage.saveStudent(updatedStudent);
                resolve({ fallback: true });
                return true;
              }
            );
          },
          () => {
            storage.saveStudent(updatedStudent);
            resolve({ fallback: true });
          }
        );
        return;
      } catch (e) {
        console.warn('SQLite updateLearner error, using storage fallback:', e);
      }
    }
    storage.saveStudent(updatedStudent);
    resolve({ rowsAffected: 1, student: updatedStudent });
  });
};

/**
 * Bulk delete multiple learners by ID from SQLite database and local storage
 */
export const bulkDeleteLearners = (
  ids: (string | number)[],
  customDb?: SQLiteDatabase
): Promise<any> => {
  const targetDb = customDb || getDatabase();
  const idStrs = ids.map(x => String(x).trim());
  return new Promise((resolve, reject) => {
    if (ids.length === 0) return resolve({ rowsAffected: 0, deletedIds: [] });

    if (targetDb && typeof targetDb.transaction === 'function') {
      try {
        const placeholders = ids.map(() => '?').join(',');
        targetDb.transaction(
          (tx: SQLiteTransaction) => {
            tx.executeSql(
              `DELETE FROM learners WHERE id IN (${placeholders});`,
              ids,
              (_: SQLiteTransaction, result: any) => {
                storage.bulkDeleteStudents(idStrs);
                resolve(result);
              },
              (_: SQLiteTransaction, error: any) => {
                reject(error);
                return true;
              }
            );
          },
          (err: any) => reject(err)
        );
        return;
      } catch (e) {
        console.warn('SQLite bulkDeleteLearners error, using storage fallback:', e);
      }
    }
    const remaining = storage.bulkDeleteStudents(idStrs);
    resolve({ rowsAffected: ids.length, deletedIds: idStrs, remainingCount: remaining.length });
  });
};

/**
 * Standard bulk add learners function matching Expo-SQLite signature.
 * If an Expo SQLite database instance is passed, it executes transactions on the SQLite DB.
 * If called in the Web PWA environment, it persists directly to EduHub storage and resolves.
 * 
 * @param learnersArray Array of learner records with name, grade, gender
 * @param customDb Optional expo-sqlite database instance
 */
export const bulkAddLearners = (
  learnersArray: LearnerInput[],
  customDb?: SQLiteDatabase
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!learnersArray || !Array.isArray(learnersArray) || learnersArray.length === 0) {
      return reject(new Error('learnersArray must be a non-empty array of learner objects.'));
    }

    // 1. If Expo-SQLite customDb instance is provided, use SQLite transaction
    if (customDb && typeof customDb.transaction === 'function') {
      try {
        customDb.transaction(
          (tx: SQLiteTransaction) => {
            learnersArray.forEach((student) => {
              tx.executeSql(
                'INSERT INTO learners (name, grade, gender) VALUES (?, ?, ?);',
                [student.name, student.grade, student.gender],
                () => {},
                (_: any, error: any) => {
                  if (error) {
                    reject(error);
                    return true;
                  }
                  return false;
                }
              );
            });
          },
          (error: any) => reject(error),
          () => {
            // Also sync to web local storage so UI reflects immediately
            storage.bulkAddLearners(learnersArray).then(() => {
              resolve('All learners added successfully to SQLite and EduHub!');
            }).catch(() => {
              resolve('All learners added successfully!');
            });
          }
        );
        return;
      } catch (err) {
        // Fall back to storage service
        console.warn('SQLite transaction failed, saving to storage service:', err);
      }
    }

    // 2. Web & Standalone PWA environment: Save via EduHub Storage Engine
    storage
      .bulkAddLearners(learnersArray)
      .then((res) => {
        resolve(res.message || 'All learners added successfully!');
      })
      .catch((err) => reject(err));
  });
};

/**
 * Generates an executable SQLite SQL dump file of all learners
 */
export const generateSqliteLearnersSQL = (learners: Student[]): string => {
  const lines: string[] = [
    '--',
    '-- Little Roses EduHub - SQLite Learners Database Export',
    `-- Exported At: ${new Date().toISOString()}`,
    '--',
    '',
    'BEGIN TRANSACTION;',
    '',
    SQLITE_LEARNERS_SCHEMA.trim(),
    ''
  ];

  learners.forEach((l) => {
    const esc = (val: string) => (val || '').replace(/'/g, "''");
    lines.push(
      `INSERT INTO learners (id, name, grade, gender, admission_number, parent_name, parent_phone) VALUES ('${esc(l.id)}', '${esc(l.name)}', '${esc(l.grade)}', '${esc(l.gender)}', '${esc(l.admissionNumber)}', '${esc(l.parentName || '')}', '${esc(l.parentPhone || '')}');`
    );
  });

  lines.push('');
  lines.push('COMMIT;');
  return lines.join('\n');
};

/**
 * Generates an executable SQLite SQL dump file of all timetable slots
 */
export const generateSqliteTimetableSQL = (slots: TimetableSlot[]): string => {
  const lines: string[] = [
    '--',
    '-- Little Roses EduHub - SQLite Timetable Database Export',
    `-- Exported At: ${new Date().toISOString()}`,
    '--',
    '',
    'BEGIN TRANSACTION;',
    '',
    SQLITE_TIMETABLE_SCHEMA.trim(),
    ''
  ];

  slots.forEach((s) => {
    const esc = (val: string) => (val || '').replace(/'/g, "''");
    lines.push(
      `INSERT INTO timetable (day, time_slot, subject, grade) VALUES ('${esc(s.day)}', '${esc(s.timeSlot)}', '${esc(s.subject)}', '${esc(s.grade)}');`
    );
  });

  lines.push('');
  lines.push('COMMIT;');
  return lines.join('\n');
};

