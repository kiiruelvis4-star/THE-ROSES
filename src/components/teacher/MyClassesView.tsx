import React, { useState } from 'react';
import { 
  GradeLevel, 
  Student, 
  STANDARD_SUBJECTS 
} from '../../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Award, 
  CheckCircle2, 
  Phone, 
  ChevronRight,
  TrendingUp,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { calculateStudentOverallPercentage, getCBCRating } from '../../data/initialData';
import { storage } from '../../services/storageService';

interface MyClassesViewProps {
  students: Student[];
  onOpenLearnerDashboard?: (studentId: string) => void;
  onSelectStudent?: (studentId: string) => void;
  onOpenAddStudentModal?: (defaultGrade?: GradeLevel) => void;
  onAddNewStudent?: () => void;
  onEditStudent: (student: Student) => void;
}

const GRADES: GradeLevel[] = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

export const MyClassesView: React.FC<MyClassesViewProps> = ({
  students,
  onOpenLearnerDashboard,
  onSelectStudent,
  onOpenAddStudentModal,
  onAddNewStudent,
  onEditStudent
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | null>('Grade 6');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All');

  const handleSelectLearner = (studentId: string) => {
    if (typeof onOpenLearnerDashboard === 'function') {
      onOpenLearnerDashboard(studentId);
    } else if (typeof onSelectStudent === 'function') {
      onSelectStudent(studentId);
    }
  };

  const handleAddLearner = (grade?: GradeLevel) => {
    if (typeof onOpenAddStudentModal === 'function') {
      onOpenAddStudentModal(grade);
    } else if (typeof onAddNewStudent === 'function') {
      onAddNewStudent();
    }
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesGrade = !selectedGrade || s.grade === selectedGrade;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === 'All' || s.gender === genderFilter;
    return matchesGrade && matchesSearch && matchesGender;
  });

  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}'s student record? This cannot be undone.`)) {
      storage.deleteStudent(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header with quick count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
            My Classes & Learner Records
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Select a grade to inspect learners, manage CBC assessment marks, and view individualized learner dashboards.
          </p>
        </div>

        <button
          onClick={() => handleAddLearner(selectedGrade || 'Grade 6')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-950/20 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Add Learner
        </button>
      </div>

      {/* Grade Level Selector Buttons (Grade 1 - Grade 6) */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {GRADES.map(grade => {
          const count = students.filter(s => s.grade === grade).length;
          const isSelected = selectedGrade === grade;
          return (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? 'bg-blue-900 border-blue-900 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
              }`}
            >
              <span className="font-extrabold text-sm">{grade}</span>
              <span className={`text-[11px] font-semibold ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                {count} {count === 1 ? 'Pupil' : 'Pupils'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by pupil name or adm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            {(['All', 'Male', 'Female'] as const).map(g => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  genderFilter === g
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing {filteredStudents.length}
          </span>
        </div>
      </div>

      {/* Student Roster Cards */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-700 dark:text-slate-300">No learners found</p>
          <p className="text-xs text-slate-500 mt-1">Try changing the search query or grade selector.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student) => {
            const overallPct = calculateStudentOverallPercentage(student);
            const rating = getCBCRating(overallPct);

            return (
              <div
                key={student.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {student.avatarUrl ? (
                        <img
                          src={student.avatarUrl}
                          alt={student.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-900 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black text-base flex items-center justify-center border-2 border-blue-200 dark:border-blue-900 shrink-0">
                          {student.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                          {student.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-mono font-medium">{student.admissionNumber}</span>
                          <span>•</span>
                          <span className="font-semibold">{student.grade}</span>
                          <span>•</span>
                          <span>{student.gender}</span>
                        </div>
                      </div>
                    </div>

                    {/* Overall Progress Badge */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          {overallPct}%
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rating.bg} text-white`}>
                        {rating.code}
                      </span>
                    </div>
                  </div>

                  {/* Parent & Attendance summary */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Parent / Guardian</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{student.parentName}</span>
                      <div className="text-[11px] text-slate-500">{student.parentPhone}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance Rate</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{student.attendanceRate}% Present</span>
                      <div className="text-[11px] text-slate-500">Regular & Punctual</div>
                    </div>
                  </div>

                  {student.teacherRemarks && (
                    <div className="mt-2.5 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs italic text-slate-600 dark:text-slate-300">
                      "{student.teacherRemarks}"
                    </div>
                  )}
                </div>

                {/* Actions: Open Learner Dashboard, Edit, Delete */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditStudent(student)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1 font-semibold"
                      title="Edit Learner Details"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id, student.name)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors text-xs"
                      title="Delete Learner Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Primary CTA: Open individual Learner Dashboard */}
                  <button
                    onClick={() => handleSelectLearner(student.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
                  >
                    <span>Learner Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
