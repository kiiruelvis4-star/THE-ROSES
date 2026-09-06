import React, { useState } from 'react';
import { Student, Assignment } from '../../types';
import { 
  FileCheck, 
  ArrowLeft, 
  Clock, 
  Paperclip, 
  CheckCircle2, 
  Send, 
  Award, 
  Sparkles,
  UploadCloud
} from 'lucide-react';
import { storage } from '../../services/storageService';

interface LearnerAssignmentsViewProps {
  student: Student;
  assignments: Assignment[];
  onBack: () => void;
}

export const LearnerAssignmentsView: React.FC<LearnerAssignmentsViewProps> = ({
  student,
  assignments,
  onBack
}) => {
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submittedIds, setSubmittedIds] = useState<string[]>(['asg-01']); // sample submitted

  const gradeAssignments = assignments.filter(a => a.grade === student.grade);

  const handleSubmitWork = (asgId: string) => {
    if (!submissionText.trim()) {
      alert('Please type your homework answers or attach your work before submitting.');
      return;
    }
    setSubmittedIds(prev => [...prev, asgId]);
    alert('Your assignment has been successfully submitted to your class teacher!');
    setActiveAssignment(null);
    setSubmissionText('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-blue-600" />
          <span>My Homework & Take-Home Assignments</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Complete and submit tasks assigned by Little Roses Academy teachers for {student.grade}.
        </p>
      </div>

      {/* Grid of Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gradeAssignments.map((asg) => {
          const isSubmitted = submittedIds.includes(asg.id);

          return (
            <div
              key={asg.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-xs">
                    {asg.subject}
                  </span>

                  {isSubmitted ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Due: {asg.dueDate}
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-3">
                  {asg.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {asg.instructions}
                </p>

                {asg.attachments && asg.attachments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {asg.attachments.map((att, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Paperclip className="w-3 h-3 text-slate-400" />
                        {att.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Total: {asg.totalMarks} Marks</span>

                {isSubmitted ? (
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Award className="w-4 h-4" /> Marked: {Math.round(asg.totalMarks * 0.9)} / {asg.totalMarks}
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveAssignment(asg)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Work
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal / Sheet */}
      {activeAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Submit Work For</span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {activeAssignment.title} ({activeAssignment.subject})
                </h3>
              </div>
              <button
                onClick={() => setActiveAssignment(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Type your answers / work steps:
              </label>
              <textarea
                rows={5}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Write your response, formulas, or short essays here..."
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Attach simulated photo or PDF */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
              <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Attach Exercise Book Photo or Document</p>
              <input
                type="file"
                className="text-xs text-slate-500 mt-1 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveAssignment(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitWork(activeAssignment.id)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
