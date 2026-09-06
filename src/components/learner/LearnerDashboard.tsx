import React, { useState } from 'react';
import { 
  Student, 
  Assignment, 
  Quiz, 
  ResourceItem, 
  CalendarEvent,
  SubjectName 
} from '../../types';
import { 
  BookOpen, 
  Award, 
  Target, 
  FileCheck, 
  GraduationCap, 
  HelpCircle, 
  FileText, 
  TrendingUp, 
  Bell, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  User,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Printer
} from 'lucide-react';
import { calculateStudentOverallPercentage, getCBCRating } from '../../data/initialData';
import { LearnerCATsView } from './LearnerCATsView';
import { LearnerSubjectsView } from './LearnerSubjectsView';
import { LearnerStrandsView } from './LearnerStrandsView';
import { LearnerAssignmentsView } from './LearnerAssignmentsView';
import { LearnerRevisionBooksView } from './LearnerRevisionBooksView';
import { LearnerQuizZoneView } from './LearnerQuizZoneView';
import { LearnerResultsView } from './LearnerResultsView';
import { LearnerProgressAnalyticsView } from './LearnerProgressAnalyticsView';
import { LearnerNoticesView } from './LearnerNoticesView';

interface LearnerDashboardProps {
  student: Student;
  allStudents: Student[];
  assignments: Assignment[];
  quizzes: Quiz[];
  resources: ResourceItem[];
  events: CalendarEvent[];
  onSwitchStudent: (studentId: string) => void;
  onBackToPortals: () => void;
  isTeacherViewing?: boolean;
}

export type LearnerSubView = 
  | 'overview' 
  | 'subjects' 
  | 'cats' 
  | 'strands' 
  | 'assignments' 
  | 'revision' 
  | 'quizzes' 
  | 'results' 
  | 'progress' 
  | 'notices';

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({
  student,
  allStudents,
  assignments,
  quizzes,
  resources,
  events,
  onSwitchStudent,
  onBackToPortals,
  isTeacherViewing = false
}) => {
  const [activeSubView, setActiveSubView] = useState<LearnerSubView>('overview');

  const overallPct = calculateStudentOverallPercentage(student);
  const overallRating = getCBCRating(overallPct);

  const handleGeneratePDFReport = () => {
    setActiveSubView('results');
    setTimeout(() => {
      window.print();
    }, 450);
  };

  // SVG Circular progress math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPct / 100) * circumference;

  const ACTION_CARDS = [
    {
      id: 'subjects' as LearnerSubView,
      title: 'My Subjects',
      desc: 'Syllabi, 8 core subjects, curriculum designs & teachers',
      icon: BookOpen,
      iconBg: 'bg-blue-600 text-white',
      badge: '8 Subjects'
    },
    {
      id: 'cats' as LearnerSubView,
      title: 'CATs & Assessments',
      desc: 'Continuous assessment test scores, CAT 1, CAT 2 & End Term',
      icon: Award,
      iconBg: 'bg-amber-500 text-white',
      badge: `${overallPct}% Mean`
    },
    {
      id: 'strands' as LearnerSubView,
      title: 'Strand Assessment',
      desc: 'Core 7 CBC competencies & formative learning rubrics',
      icon: Target,
      iconBg: 'bg-rose-600 text-white',
      badge: '7 Pillars'
    },
    {
      id: 'assignments' as LearnerSubView,
      title: 'Assignments',
      desc: 'Take-home homework, project instructions & submissions',
      icon: FileCheck,
      iconBg: 'bg-emerald-600 text-white',
      badge: '3 Active'
    },
    {
      id: 'revision' as LearnerSubView,
      title: 'Revision Books',
      desc: 'CBC textbooks, digital notes, past papers & study guides',
      icon: GraduationCap,
      iconBg: 'bg-indigo-600 text-white',
      badge: 'E-Library'
    },
    {
      id: 'quizzes' as LearnerSubView,
      title: 'Quiz Zone',
      desc: 'Interactive timed quizzes, gamified tests & instant points',
      icon: HelpCircle,
      iconBg: 'bg-pink-600 text-white',
      badge: 'Play & Learn'
    },
    {
      id: 'results' as LearnerSubView,
      title: 'My Results & Report Card',
      desc: 'Official printable CBC progress report with teacher remarks',
      icon: FileText,
      iconBg: 'bg-purple-600 text-white',
      badge: 'Official Stamp'
    },
    {
      id: 'progress' as LearnerSubView,
      title: 'Growth & Progress',
      desc: 'Performance charts, subject rankings & growth trajectories',
      icon: TrendingUp,
      iconBg: 'bg-teal-600 text-white',
      badge: 'Analytics'
    },
    {
      id: 'notices' as LearnerSubView,
      title: 'School Notices',
      desc: 'Announcements, term dates & Headteacher communications',
      icon: Bell,
      iconBg: 'bg-orange-500 text-white',
      badge: 'Circulars'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Teacher viewing learner notice banner if opened from Teacher portal */}
      {isTeacherViewing && (
        <div className="mb-6 p-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-between shadow-xs">
          <span>
            ★ Teacher Inspection Mode: You are viewing individual learner portfolio for <strong>{student.name} ({student.grade})</strong>.
          </span>
          <button
            onClick={onBackToPortals}
            className="px-3 py-1 bg-slate-950 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
          >
            Return to Teacher Portal
          </button>
        </div>
      )}

      {/* SUB-VIEW ROUTING */}
      {activeSubView === 'subjects' && (
        <LearnerSubjectsView student={student} onBack={() => setActiveSubView('overview')} />
      )}

      {activeSubView === 'cats' && (
        <LearnerCATsView student={student} onBack={() => setActiveSubView('overview')} />
      )}

      {activeSubView === 'strands' && (
        <LearnerStrandsView student={student} onBack={() => setActiveSubView('overview')} />
      )}

      {activeSubView === 'assignments' && (
        <LearnerAssignmentsView student={student} assignments={assignments} onBack={() => setActiveSubView('overview')} />
      )}

      {activeSubView === 'revision' && (
        <LearnerRevisionBooksView student={student} resources={resources} onBack={() => setActiveSubView('overview')} />
      )}

      {activeSubView === 'quizzes' && (
        <LearnerQuizZoneView student={student} quizzes={quizzes} onBack={() => setActiveSubView('overview')} />
      )}

      {activeSubView === 'results' && (
        <LearnerResultsView student={student} onBack={() => setActiveSubView('overview')} />
      )}

      {activeSubView === 'progress' && (
        <LearnerProgressAnalyticsView student={student} onBack={() => setActiveSubView('overview')} />
      )}

      {activeSubView === 'notices' && (
        <LearnerNoticesView student={student} onBack={() => setActiveSubView('overview')} />
      )}

      {/* OVERVIEW (MAIN LEARNER HUB) */}
      {activeSubView === 'overview' && (
        <div className="space-y-6 animate-fadeIn pb-16">
          {/* PERSONALIZED HEADER WITH DYNAMIC PROGRESS RING */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 text-white rounded-3xl shadow-xl relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              {/* Left Profile Info */}
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                {/* Avatar with status ring */}
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 to-rose-300 shadow-lg">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover bg-white/10"
                    />
                  </div>
                  <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-rose-900 flex items-center justify-center text-[10px] text-white">
                    ✓
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-rose-100 text-xs font-bold">
                    <span>{student.grade} • Term 1, 2026</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
                    {student.name}
                  </h1>

                  <p className="text-xs text-rose-200 font-mono">
                    Adm: {student.admissionNumber} • Little Roses Academy
                  </p>

                  <p className="text-[11px] font-serif italic text-rose-300">
                    "Much from Little"
                  </p>
                </div>
              </div>

              {/* Right: Dynamic Overall Progress Ring Indicator */}
              <div className="flex items-center gap-5 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shadow-inner">
                {/* SVG Circular Progress Ring */}
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      className="stroke-white/20"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    {/* Progress Arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      className="stroke-emerald-400 transition-all duration-1000 ease-out"
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-white leading-none">
                      {overallPct}%
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-rose-200 mt-0.5">
                      Overall
                    </span>
                  </div>
                </div>

                {/* Progress Details */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200 block">
                    CBC Assessment Rating
                  </span>
                  <div className="inline-block px-2.5 py-1 rounded-full bg-emerald-500 text-white font-black text-xs shadow-xs">
                    {overallRating.label}
                  </div>
                  <p className="text-[11px] text-rose-100 font-medium">
                    Calculated from 8 CBC Learning Areas
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Switch Learner Dropdown & Printable PDF Trigger */}
            <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-rose-200 font-medium">Switch Learner:</span>
                <select
                  value={student.id}
                  onChange={(e) => onSwitchStudent(e.target.value)}
                  className="px-3 py-1 bg-black/30 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none"
                >
                  {allStudents.map((s) => (
                    <option key={s.id} value={s.id} className="text-slate-900">
                      {s.name} ({s.grade} - {s.admissionNumber})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleGeneratePDFReport}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-rose-950 hover:bg-rose-50 font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
                  title="Generate official printable CBC PDF report card with CAT scores"
                >
                  <Printer className="w-3.5 h-3.5 text-rose-600" />
                  <span>Printable PDF Report Card</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-rose-200 text-[11px]">
                <span>Punctuality: <strong>100%</strong></span>
                <span>•</span>
                <span>House: <strong>Rose Red</strong></span>
              </div>
            </div>
          </div>

          {/* ACTION GRID (9 CARDS) */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white font-heading">
                  Learner Portal Quick Access
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  Select an area to explore learning materials, CAT scores, and report cards
                </span>
              </div>
              <button
                onClick={handleGeneratePDFReport}
                className="inline-flex items-center self-start sm:self-auto gap-2 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Generate PDF Report Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACTION_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    onClick={() => setActiveSubView(card.id)}
                    className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-400 dark:hover:border-rose-600 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-rose-50 dark:group-hover:bg-rose-950 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors">
                          {card.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {card.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-xs font-bold text-rose-700 dark:text-rose-400 group-hover:translate-x-1 transition-transform">
                      <span>Open {card.title}</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
