import * as SQLite from 'expo-sqlite';
import initialLearners from './learnersData.json';

const db = SQLite.openDatabaseSync('eduhub.db');

export const initAndSeedDB = () => {
  // 1. Create table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS learners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      grade TEXT NOT NULL,
      gender TEXT NOT NULL
    );
  `);

  // 2. Check if DB is already seeded
  const existingCount = db.getFirstSync('SELECT COUNT(*) as count FROM learners;');
  
  // 3. Bulk insert all 41 learners in one fast transaction
  if (existingCount && existingCount.count === 0) {
    db.withTransactionSync(() => {
      for (const learner of initialLearners) {
        db.runSync(
          'INSERT INTO learners (name, grade, gender) VALUES (?, ?, ?);',
          [learner.name, learner.grade, learner.gender]
        );
      }
    });
    console.log('Bulk insert completed successfully! 🥳');
  }
};
