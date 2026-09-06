import React from 'react';
import { Student } from '../../types';
import { 
  Bell, 
  ArrowLeft, 
  Calendar, 
  Mail, 
  Phone, 
  AlertCircle, 
  Award, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';

interface LearnerNoticesViewProps {
  student: Student;
  onBack: () => void;
}

const NOTICES = [
  {
    id: 'n-1',
    title: 'Term 1 Mid-Term Break Advisory',
    category: 'Academic Schedule',
    date: 'February 2026',
    author: 'Mr. Kelvin (Headteacher)',
    important: true,
    content: 'All learners will break for Mid-Term from Thursday, February 26th to Sunday, March 1st. Classes resume promptly on Monday at 7:30 AM.'
  },
  {
    id: 'n-2',
    title: 'Inter-House Athletics & Sports Day Championship',
    category: 'Co-Curricular',
    date: 'March 2026',
    author: 'Sports Department',
    important: false,
    content: 'The annual Little Roses Academy sports festival will take place on March 18th at the school grounds. Parents and guardians are warmly invited.'
  },
  {
    id: 'n-3',
    title: 'CBC Grade 6 Project Submissions Reminder',
    category: 'Curriculum & Assessment',
    date: 'March 2026',
    author: 'Tr. Jane Wangari',
    important: true,
    content: 'Grade 6 learners must ensure all Agriculture and Creative Arts project portfolios are handed in for formative grading before March 12th.'
  },
  {
    id: 'n-4',
    title: 'Parent-Teacher Consultative Conference (PTA)',
    category: 'Administration',
    date: 'April 2026',
    author: 'Little Roses Board of Management',
    important: false,
    content: 'Individual academic clinic with subject teachers to discuss learner progress reports will be held in the main school hall.'
  }
];

export const LearnerNoticesView: React.FC<LearnerNoticesViewProps> = ({
  student,
  onBack
}) => {
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
          <Bell className="w-6 h-6 text-amber-500" />
          <span>School Notices & Official Circulars</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Official announcements, term dates, and administrative bulletins from Little Roses Academy.
        </p>
      </div>

      {/* Official Helpdesk Banner */}
      <div className="p-5 bg-blue-900 text-white rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200">
            School Administration Office
          </span>
          <h3 className="font-black text-base">Little Roses Academy Inquiries</h3>
          <p className="text-xs text-blue-100 max-w-lg">
            Have questions regarding term schedules, fee clearance, or learner progress? Reach out directly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <a
            href="mailto:roseslittle3@gmail.com"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 rounded-xl font-bold transition-colors"
          >
            <Mail className="w-4 h-4 text-rose-300" />
            roseslittle3@gmail.com
          </a>
          <a
            href="tel:0798193966"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white text-blue-950 hover:bg-blue-50 rounded-xl font-extrabold transition-colors shadow-sm"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            0798 193966 (Mr. Kelvin)
          </a>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NOTICES.map((notice) => (
          <div
            key={notice.id}
            className={`p-5 rounded-2xl border shadow-sm space-y-3 transition-shadow ${
              notice.important
                ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                notice.important ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {notice.category}
              </span>

              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {notice.date}
              </span>
            </div>

            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {notice.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {notice.content}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Issued by: <strong>{notice.author}</strong></span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Official
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
