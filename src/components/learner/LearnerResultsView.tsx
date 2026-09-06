import React from 'react';
import { Student, STANDARD_SUBJECTS } from '../../types';
import { 
  Award, 
  ArrowLeft, 
  Printer, 
  Download, 
  CheckCircle, 
  Calendar, 
  User, 
  Sparkles,
  School
} from 'lucide-react';
import { calculateStudentOverallPercentage, getCBCRating } from '../../data/initialData';
import { SchoolLogo } from '../SchoolLogo';
import { storage } from '../../services/storageService';

interface LearnerResultsViewProps {
  student: Student;
  onBack: () => void;
}

const SUBJECT_REMARKS: Record<string, string> = {
  'Mathematics': 'Has strong number sense and computational speed. Keep up the high standard.',
  'English': 'Expresses ideas fluently in spoken and written English. Good vocabulary.',
  'Kiswahili': 'Kazi nzuri sana katika sarufi na kuandika insha safi.',
  'Science': 'Shows inquisitive scientific mindset and great lab safety awareness.',
  'Agriculture': 'Actively participates in organic farming and environmental conservation.',
  'Creative Arts': 'Demonstrates artistic flair and rhythmic precision in music.',
  'Social Studies': 'Well informed on civic responsibilities and geographical features.',
  'CRE': 'Exhibits exemplary Christian moral values and kindness toward peers.'
};

export const LearnerResultsView: React.FC<LearnerResultsViewProps> = ({
  student,
  onBack
}) => {
  const overallPct = calculateStudentOverallPercentage(student);
  const overallRating = getCBCRating(overallPct);
  const systemConfig = storage.getSystemConfig();
  const schoolMeta = systemConfig.school_metadata;
  const poBox = schoolMeta.po_box || 'P.O. Box 3443 NAKURU';
  const schoolName = schoolMeta.school_name || 'LITTLE ROSES ACADEMY';
  const headTeacherName = schoolMeta.head_teacher_name || 'Mr. Kelvin (Headteacher)';

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
            Official CBC Learner Progress Report Card
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {systemConfig.active_term}, {systemConfig.active_academic_year} Summative & Formative Performance Evaluation for {student.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            title="Triggers printable PDF generation via browser print engine"
          >
            <Printer className="w-4 h-4 text-rose-300" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* PRINTABLE REPORT CARD SHEET */}
      <div className="p-6 sm:p-10 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-xl space-y-6 print:border-none print:shadow-none print:p-0">
        {/* School Letterhead Header */}
        <div className="border-b-2 border-slate-900 dark:border-slate-300 pb-5 text-center space-y-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SchoolLogo size="md" badgeOnly />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black tracking-wider uppercase text-blue-950 dark:text-blue-200 font-heading">
                {schoolName}
              </h1>
              <p className="text-xs font-serif italic font-bold text-rose-700 dark:text-rose-400">
                "{schoolMeta.motto || 'Much from Little'}"
              </p>
              <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                {poBox}, Kenya • Email: {schoolMeta.email || 'roseslittle3@gmail.com'} • Tel: {schoolMeta.phone || '0798 193966'}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <span className="inline-block px-4 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest rounded-full">
              COMPETENCY-BASED CURRICULUM (CBC) LEARNER PROGRESS REPORT
            </span>
          </div>
        </div>

        {/* Student Bio Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Learner's Name</span>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">{student.name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Admission Number</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{student.admissionNumber}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Grade / Level</span>
            <span className="font-extrabold text-blue-900 dark:text-blue-300">{student.grade}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Term & Year</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">Term 1, 2026</span>
          </div>
        </div>

        {/* Subject Scores Marksheet Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-left uppercase text-[10px]">
                <th className="p-2.5 border border-slate-300 dark:border-slate-700">Learning Area (Subject)</th>
                <th className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">CAT 1 <span className="font-normal text-slate-400">(/30)</span></th>
                <th className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">CAT 2 <span className="font-normal text-slate-400">(/30)</span></th>
                <th className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">End Term <span className="font-normal text-slate-400">(/100)</span></th>
                <th className="p-2.5 border border-slate-300 dark:border-slate-700 text-center font-black">Total %</th>
                <th className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">Rating</th>
                <th className="p-2.5 border border-slate-300 dark:border-slate-700">Teacher's Formative Remarks</th>
              </tr>
            </thead>
            <tbody>
              {STANDARD_SUBJECTS.map((sub) => {
                const marks = student.catMarks[sub] || { cat1: 0, cat2: 0, endTerm: 0 };
                const subPct = Math.round((marks.cat1 / 30) * 20 + (marks.cat2 / 30) * 20 + (marks.endTerm / 100) * 60);
                const rating = getCBCRating(subPct);

                return (
                  <tr key={sub} className="border-b border-slate-300 dark:border-slate-700">
                    <td className="p-2.5 font-bold border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                      {sub}
                    </td>
                    <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center font-semibold">{marks.cat1}</td>
                    <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center font-semibold">{marks.cat2}</td>
                    <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center font-semibold">{marks.endTerm}</td>
                    <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center font-black text-blue-900 dark:text-blue-300">
                      {subPct}%
                    </td>
                    <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${rating.bg}`}>
                        {rating.code}
                      </span>
                    </td>
                    <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
                      {SUBJECT_REMARKS[sub] || 'Good progress recorded this term.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summative Performance Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-800 dark:text-blue-300">Overall Mean Performance</span>
            <div className="text-3xl font-black text-blue-950 dark:text-blue-100 mt-1">
              {overallPct}%
            </div>
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mt-0.5">
              Grade Achievement: <strong>{overallRating.label}</strong>
            </p>
          </div>

          <div className="space-y-1 text-slate-700 dark:text-slate-300">
            <span className="text-[10px] uppercase font-bold text-blue-800 dark:text-blue-300 block">Values & Conduct Evaluation:</span>
            <div className="flex items-center justify-between">
              <span>Class Attendance & Punctuality:</span>
              <strong className="text-emerald-600 font-bold">100% (Exemplary)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Co-curricular & Sports Participation:</span>
              <strong className="text-blue-700 font-bold">Athletics & Music Club</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Discipline & Peer Relations:</span>
              <strong className="text-emerald-600 font-bold">Excellent</strong>
            </div>
          </div>
        </div>

        {/* Teacher & Headteacher Sign-offs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-slate-200 dark:border-slate-700 text-xs">
          {/* Class Teacher */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Class Teacher's Remarks</span>
            <p className="italic text-slate-700 dark:text-slate-300">
              "{student.name} is a disciplined and hardworking learner who demonstrates great enthusiasm in all CBC practical projects."
            </p>
            <div className="pt-3 flex items-center justify-between text-[11px] font-bold">
              <span>Teacher: Tr. Jane Wangari</span>
              <span className="font-serif italic text-blue-900 dark:text-blue-400">Signed: J. Wangari</span>
            </div>
          </div>

          {/* Headteacher & Official Stamp */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2 relative">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Headteacher's Assessment & Official Stamp</span>
            <p className="italic text-slate-700 dark:text-slate-300">
              "Commendable performance. Promoted with merit to continue excelling in the upcoming term."
            </p>
            <div className="pt-3 flex items-center justify-between text-[11px] font-bold">
              <div>
                <span>{headTeacherName}</span>
                <p className="text-[9px] text-slate-400 font-normal">Headteacher ({schoolMeta.phone || '0798 193966'})</p>
              </div>

              {/* Official Stamp badge */}
              <div className="px-3 py-1 border-2 border-dashed border-rose-600 text-rose-700 dark:text-rose-400 text-[9px] uppercase font-black rounded-lg transform -rotate-2">
                ★ LITTLE ROSES ACADEMY SEALED ★
              </div>
            </div>
          </div>
        </div>

        {/* Next Term Date Notice */}
        <div className="text-center p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300">
          Next Term Opening Date: <span className="text-blue-900 dark:text-blue-400 font-black">May 5th, 2026</span> • All fees must be cleared prior to opening.
        </div>
      </div>
    </div>
  );
};
