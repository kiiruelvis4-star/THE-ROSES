import React, { useState } from 'react';
import { 
  Assignment, 
  GradeLevel, 
  SubjectName, 
  STANDARD_SUBJECTS 
} from '../../types';
import { 
  FileCheck, 
  Plus, 
  Calendar, 
  Clock, 
  Paperclip, 
  Edit3, 
  Trash2, 
  Users, 
  Award,
  CheckCircle,
  FileText
} from 'lucide-react';
import { storage } from '../../services/storageService';

interface AssignmentsManagerProps {
  assignments: Assignment[];
  onOpenCreateModal: () => void;
  onOpenEditModal: (assignment: Assignment) => void;
}

const GRADES: GradeLevel[] = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

export const AssignmentsManager: React.FC<AssignmentsManagerProps> = ({
  assignments,
  onOpenCreateModal,
  onOpenEditModal
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'All'>('All');
  const [selectedSubject, setSelectedSubject] = useState<SubjectName | 'All'>('All');

  const filtered = assignments.filter(a => 
    (selectedGrade === 'All' || a.grade === selectedGrade) &&
    (selectedSubject === 'All' || a.subject === selectedSubject)
  );

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete assignment "${title}"?`)) {
      storage.deleteAssignment(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
            Homework & Assignments Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Post weekly take-home assignments, rubrics, and track learner submission progress.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Post Assignment
        </button>
      </div>

      {/* Grade & Subject Filters */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase">Grade:</span>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Grades</option>
            {GRADES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase">Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Subjects</option>
            {STANDARD_SUBJECTS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignments List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-700 dark:text-slate-300">No active assignments</p>
          <p className="text-xs text-slate-500 mt-1">Click "Post Assignment" to publish new coursework.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((asg) => (
            <div
              key={asg.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-xs">
                      {asg.grade}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                      {asg.subject}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                    <Clock className="w-3.5 h-3.5" /> Due: {asg.dueDate}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-3">
                  {asg.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                  {asg.instructions}
                </p>

                {asg.attachments && asg.attachments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {asg.attachments.map((att, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px] text-slate-600 dark:text-slate-300">
                        <Paperclip className="w-3 h-3 text-slate-400" />
                        {att.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> {asg.submissionsCount || 15} Submitted
                  </span>
                  <span>•</span>
                  <span>Max: {asg.totalMarks} Mks</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenEditModal(asg)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(asg.id, asg.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
