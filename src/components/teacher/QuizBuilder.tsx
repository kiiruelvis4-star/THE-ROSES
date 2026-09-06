import React, { useState } from 'react';
import { 
  Quiz, 
  QuizQuestion, 
  GradeLevel, 
  SubjectName, 
  STANDARD_SUBJECTS 
} from '../../types';
import { 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Play, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { storage } from '../../services/storageService';

interface QuizBuilderProps {
  quizzes: Quiz[];
  onOpenCreateQuizModal: () => void;
  onOpenEditQuizModal: (quiz: Quiz) => void;
  onTakeQuizPreview: (quiz: Quiz) => void;
}

const GRADES: GradeLevel[] = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

export const QuizBuilder: React.FC<QuizBuilderProps> = ({
  quizzes,
  onOpenCreateQuizModal,
  onOpenEditQuizModal,
  onTakeQuizPreview
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'All'>('All');
  const [selectedSubject, setSelectedSubject] = useState<SubjectName | 'All'>('All');

  const filteredQuizzes = quizzes.filter(q => 
    (selectedGrade === 'All' || q.grade === selectedGrade) &&
    (selectedSubject === 'All' || q.subject === selectedSubject)
  );

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete quiz "${title}"?`)) {
      storage.deleteQuiz(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
            Quiz Zone & Interactive Test Builder
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Create gamified multiple-choice quizzes with timers, answer rationales, and automatic scoring.
          </p>
        </div>

        <button
          onClick={onOpenCreateQuizModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create New Quiz
        </button>
      </div>

      {/* Filter bar */}
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

      {/* Quizzes List */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-700 dark:text-slate-300">No quizzes found</p>
          <p className="text-xs text-slate-500 mt-1">Click "Create New Quiz" to compose interactive revision tests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-xs">
                      {quiz.grade}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold text-xs">
                      {quiz.subject}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    <Clock className="w-3.5 h-3.5" /> {quiz.timeLimitMinutes} mins
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-3">
                  {quiz.title}
                </h3>

                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{quiz.questions.length} Questions</span> included in challenge.
                </div>

                {/* Sample question preview */}
                {quiz.questions[0] && (
                  <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Sample Item:</span>
                    <p className="font-medium text-slate-700 dark:text-slate-300 italic">"{quiz.questions[0].question}"</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onTakeQuizPreview(quiz)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Preview & Test Play
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenEditQuizModal(quiz)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz.id, quiz.title)}
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
