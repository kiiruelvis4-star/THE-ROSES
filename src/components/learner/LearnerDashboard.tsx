import React, { useState, useEffect } from 'react';
import { 
  Student, 
  Assignment, 
  Quiz, 
  ResourceItem, 
  CalendarEvent 
} from '../../types';
import { 
  BookOpen, 
  Award, 
  Target, 
  ClipboardList, 
  BookMarked, 
  Brain, 
  Trophy, 
  TrendingUp, 
  Megaphone,
  Bell, 
  Camera, 
  Calendar as CalendarIcon, 
  Home as HomeIcon, 
  Mail, 
  User as UserIcon, 
  Menu, 
  X, 
  CheckCircle2, 
  WifiOff, 
  ShieldCheck, 
  ChevronLeft,
  Phone,
  MapPin,
  HeartPulse,
  Sparkles,
  LogOut,
  Moon,
  Sun,
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
import { LearnerEditProfileModal } from '../modals/LearnerEditProfileModal';
import { LearnerPhotoUploadModal } from '../modals/LearnerPhotoUploadModal';
import { storage } from '../../services/storageService';

interface LearnerDashboardProps {
  student: Student;
  allStudents?: Student[];
  assignments: Assignment[];
  quizzes: Quiz[];
  resources: ResourceItem[];
  events: CalendarEvent[];
  onSwitchStudent?: (studentId: string) => void;
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
  | 'notices'
  | 'calendar'
  | 'profile';

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({
  student,
  assignments,
  quizzes,
  resources,
  events,
  onBackToPortals,
  isTeacherViewing = false
}) => {
  const [activeSubView, setActiveSubView] = useState<LearnerSubView>('overview');
  const [currentStudent, setCurrentStudent] = useState<Student>(student);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    setCurrentStudent(student);
  }, [student]);

  const overallPct = calculateStudentOverallPercentage(currentStudent);
  const overallRating = getCBCRating(overallPct);

  // SVG Circular progress gauge calculations
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPct / 100) * circumference;

  const firstName = currentStudent.name.split(' ')[0] || 'Learner';

  const handlePhotoUpdated = (newAvatarUrl: string) => {
    const updated = { ...currentStudent, avatar: newAvatarUrl };
    setCurrentStudent(updated);
    storage.updateStudentAvatar(currentStudent.id, newAvatarUrl);
  };

  // The 9 Grid Actions precisely matching the user's uploaded image
  const GRID_ITEMS = [
    {
      id: 'subjects' as LearnerSubView,
      title: 'My Subjects',
      icon: (
        <div className="relative w-8 h-8 flex items-center justify-center">
          <span className="text-2xl select-none">📚</span>
        </div>
      ),
      iconFallback: <BookOpen className="w-6 h-6 text-blue-600" />,
      tag: '8 Subjects'
    },
    {
      id: 'cats' as LearnerSubView,
      title: 'CATs',
      icon: (
        <div className="flex items-end gap-1 h-7 px-1 py-0.5">
          <div className="w-2 h-4 rounded-sm bg-blue-500" />
          <div className="w-2 h-6 rounded-sm bg-amber-500" />
          <div className="w-2 h-5 rounded-sm bg-rose-500" />
        </div>
      ),
      iconFallback: <Award className="w-6 h-6 text-amber-500" />,
      tag: `${overallPct}% Mean`
    },
    {
      id: 'strands' as LearnerSubView,
      title: 'Strand Assessment',
      icon: (
        <div className="relative w-8 h-8 flex items-center justify-center">
          <span className="text-2xl select-none">🎯</span>
        </div>
      ),
      iconFallback: <Target className="w-6 h-6 text-rose-600" />,
      tag: '7 Pillars'
    },
    {
      id: 'assignments' as LearnerSubView,
      title: 'Assignments',
      icon: (
        <div className="relative w-8 h-8 flex items-center justify-center">
          <span className="text-2xl select-none">📋</span>
        </div>
      ),
      iconFallback: <ClipboardList className="w-6 h-6 text-blue-600" />,
      tag: '3 Active'
    },
    {
      id: 'revision' as LearnerSubView,
      title: 'Revision Books',
      icon: (
        <div className="relative w-8 h-8 flex items-center justify-center">
          <span className="text-2xl select-none">📖</span>
        </div>
      ),
      iconFallback: <BookMarked className="w-6 h-6 text-emerald-600" />,
      tag: 'Library'
    },
    {
      id: 'quizzes' as LearnerSubView,
      title: 'Quiz Zone',
      icon: (
        <div className="relative w-8 h-8 flex items-center justify-center">
          <span className="text-2xl select-none">🧠</span>
        </div>
      ),
      iconFallback: <Brain className="w-6 h-6 text-pink-600" />,
      tag: 'Play & Learn'
    },
    {
      id: 'results' as LearnerSubView,
      title: 'My Results',
      icon: (
        <div className="relative w-8 h-8 flex items-center justify-center">
          <span className="text-2xl select-none">🏆</span>
        </div>
      ),
      iconFallback: <Trophy className="w-6 h-6 text-amber-500" />,
      tag: 'Report Card'
    },
    {
      id: 'progress' as LearnerSubView,
      title: 'Progress',
      icon: (
        <div className="relative w-8 h-8 flex items-center justify-center">
          <span className="text-2xl select-none">📈</span>
        </div>
      ),
      iconFallback: <TrendingUp className="w-6 h-6 text-blue-600" />,
      tag: 'Growth'
    },
    {
      id: 'notices' as LearnerSubView,
      title: 'Notices',
      icon: (
        <div className="relative w-8 h-8 flex items-center justify-center">
          <span className="text-2xl select-none">📢</span>
        </div>
      ),
      iconFallback: <Megaphone className="w-6 h-6 text-orange-500" />,
      tag: 'School Circulars'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors">
      {/* Teacher inspection banner if opened from Teacher portal */}
      {isTeacherViewing && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xs z-30">
          <span>
            ★ Teacher Inspection Mode: Individual portfolio for <strong>{currentStudent.name} ({currentStudent.grade})</strong>
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
      {activeSubView !== 'overview' ? (
        <div className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 pb-28">
          {/* Back to Dashboard bar */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setActiveSubView('overview')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black shadow-xs hover:border-blue-500 transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 text-rose-600" />
              <span>Learner Dashboard</span>
            </button>

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {currentStudent.name} • {currentStudent.grade}
            </span>
          </div>

          {activeSubView === 'subjects' && (
            <LearnerSubjectsView student={currentStudent} onBack={() => setActiveSubView('overview')} />
          )}

          {activeSubView === 'cats' && (
            <LearnerCATsView student={currentStudent} onBack={() => setActiveSubView('overview')} />
          )}

          {activeSubView === 'strands' && (
            <LearnerStrandsView student={currentStudent} onBack={() => setActiveSubView('overview')} />
          )}

          {activeSubView === 'assignments' && (
            <LearnerAssignmentsView student={currentStudent} assignments={assignments} onBack={() => setActiveSubView('overview')} />
          )}

          {activeSubView === 'revision' && (
            <LearnerRevisionBooksView student={currentStudent} resources={resources} onBack={() => setActiveSubView('overview')} />
          )}

          {activeSubView === 'quizzes' && (
            <LearnerQuizZoneView student={currentStudent} quizzes={quizzes} onBack={() => setActiveSubView('overview')} />
          )}

          {activeSubView === 'results' && (
            <LearnerResultsView student={currentStudent} onBack={() => setActiveSubView('overview')} />
          )}

          {activeSubView === 'progress' && (
            <LearnerProgressAnalyticsView student={currentStudent} onBack={() => setActiveSubView('overview')} />
          )}

          {activeSubView === 'notices' && (
            <LearnerNoticesView student={currentStudent} onBack={() => setActiveSubView('overview')} />
          )}

          {/* CALENDAR SUB-VIEW */}
          {activeSubView === 'calendar' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black font-heading">Term 1, 2026 Academic Calendar</h2>
                    <p className="text-xs text-slate-500">Scheduled school events, assessments & activities</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {events.length > 0 ? (
                    events.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            {evt.date}
                          </span>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {evt.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {evt.description || 'Academic milestone & school session'}
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-xl">
                          {evt.category || 'Official'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-500">
                      No calendar events scheduled for this period.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PROFILE SUB-VIEW (WITH EDITABLE PICTURE & DETAILS WITHOUT FEES OR DIET) */}
          {activeSubView === 'profile' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                {/* Photo & Identity Banner */}
                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-rose-500 to-amber-400 shadow-xl overflow-hidden">
                      <img
                        src={currentStudent.avatar || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200'}
                        alt={currentStudent.name}
                        className="w-full h-full object-cover rounded-full bg-slate-200 dark:bg-slate-800"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPhotoUploadOpen(true)}
                      className="absolute bottom-0 right-0 p-2 bg-rose-700 hover:bg-rose-800 text-white rounded-full shadow-lg transition-transform active:scale-90"
                      title="Change Picture"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 flex-1">
                    <h2 className="text-xl font-black font-heading text-slate-900 dark:text-white">
                      {currentStudent.name}
                    </h2>
                    <p className="text-xs font-mono text-slate-500">
                      Admission Number: <strong className="text-slate-800 dark:text-slate-200">{currentStudent.admissionNumber}</strong>
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 font-bold">
                      {currentStudent.grade} • Little Roses Academy Nakuru
                    </p>
                    <p className="text-[11px] text-slate-400 italic">
                      "Much from Little"
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPhotoUploadOpen(true)}
                      className="px-3.5 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5 transition-all"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Edit Picture</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditProfileOpen(true)}
                      className="px-3.5 py-2 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <span>Edit Details</span>
                    </button>
                  </div>
                </div>

                {/* Profile Grid: Contacts, Residence, Health, Talents (NO FEES, NO DIET) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Parent / Guardian
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {currentStudent.parentName || 'Parent / Guardian'}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {currentStudent.parentPhone || '0700 000000'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Residence & Emergency
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-600" />
                      {currentStudent.homeAddress || 'Nakuru, Kenya'}
                    </p>
                    <p className="text-slate-500 font-mono">
                      Emergency: {currentStudent.emergencyContact || currentStudent.parentPhone || 'School Office'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Attendance & Conduct
                    </span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Attendance: {currentStudent.attendanceRate || 98}% (Exemplary)
                    </p>
                    <p className="text-slate-500">
                      Discipline Standing: Active, Positive & Respectful
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Health & Medical Notes
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <HeartPulse className="w-3 h-3 text-rose-500" />
                      {currentStudent.medicalNotes ? currentStudent.medicalNotes : 'General Health: Fit & Healthy'}
                    </p>
                    <p className="text-slate-500">
                      Physical Health & Wellness Verified
                    </p>
                  </div>
                </div>

                {/* Privacy Safeguard Notice */}
                <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                  <p className="text-xs text-blue-900 dark:text-blue-200 font-medium">
                    Strict Privacy Shield: Only authorized parents with Admission Number <strong>{currentStudent.admissionNumber}</strong> have access to this learner's files.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MAIN OVERVIEW DASHBOARD - EXACT VISUAL MATCH TO USER SCREENSHOT */
        <div className="flex-1 flex flex-col w-full max-w-md sm:max-w-lg mx-auto bg-white dark:bg-slate-900 min-h-screen shadow-2xl relative pb-28">
          {/* 1. TOP HEADER - DEEP NAVY GRADIENT */}
          <div className="bg-gradient-to-b from-[#101a30] via-[#142346] to-[#182952] text-white pt-4 pb-14 px-5 relative rounded-b-[2.5rem] shadow-xl">
            {/* Top Navigation Row: Hamburger Menu & Notification Bell with Badge */}
            <div className="flex items-center justify-between mb-5">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all"
                title="Open Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSubView('notices')}
                  className="relative w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all"
                  title="Notices"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[11px] font-black flex items-center justify-center border-2 border-[#142346]">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Profile Row: Circular Photo with Edit Camera + Hello, Name & Grade */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div 
                  onClick={() => setIsPhotoUploadOpen(true)}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-white/90 p-0.5 overflow-hidden shadow-xl cursor-pointer bg-white/10 hover:opacity-90 transition-opacity"
                  title="Click to change profile picture"
                >
                  <img
                    src={currentStudent.avatar || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200'}
                    alt={currentStudent.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsPhotoUploadOpen(true)}
                  className="absolute bottom-0 right-0 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-transform active:scale-90"
                  title="Upload picture"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-0.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 font-heading">
                  <span>Hello, {firstName}</span>
                  <span className="inline-block animate-bounce select-none text-xl">👋</span>
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  {currentStudent.grade}
                </p>
                <p className="text-[11px] text-slate-300 font-medium">
                  Term 1, 2026
                </p>
              </div>
            </div>
          </div>

          {/* 2. FLOATING OVERALL PROGRESS CARD (Overlaps header by -mt-8) */}
          <div className="px-5 -mt-8 relative z-10">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-xl shadow-slate-900/10 border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-all">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-black font-heading text-slate-900 dark:text-white">
                  Overall Progress
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {overallPct >= 75 ? 'Good job! Keep it up' : 'Continuous progress in learning areas'}
                </p>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  <span>★ {overallRating.label}</span>
                  <span className="text-slate-400">• 8 Subjects</span>
                </div>
              </div>

              {/* Progress Ring with 78% Centered */}
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
                  <circle
                    cx="30"
                    cy="30"
                    r={radius}
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r={radius}
                    className="stroke-emerald-500 transition-all duration-1000 ease-out"
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {overallPct}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 9-ACTION GRID (3 Columns x 3 Rows) */}
          <div className="p-5">
            <div className="grid grid-cols-3 gap-3">
              {GRID_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSubView(item.id)}
                  className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/90 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col items-center justify-center text-center group active:scale-95"
                >
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform mb-2">
                    {item.icon}
                  </div>
                  <span className="text-[11px] sm:text-xs font-black font-heading text-slate-800 dark:text-slate-100 leading-tight">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Feature trust bar from bottom of screenshot */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Works 100% Offline</span>
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  CBC (Grade 1-6)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-500">
                <div className="flex items-center gap-1 truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Timetable & Lessons</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Revision & Exam Series</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Continuous Assessments</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Safe & Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BOTTOM NAVIGATION BAR - DARK NAVY, PINNED FIXED TO BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#121c38] text-white border-t border-slate-800/60 shadow-2xl backdrop-blur-md">
        <div className="max-w-md sm:max-w-lg mx-auto flex items-center justify-around py-2.5 px-3">
          <button
            type="button"
            onClick={() => setActiveSubView('overview')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeSubView === 'overview'
                ? 'text-white font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeSubView === 'overview' ? 'bg-white/15' : ''}`}>
              <HomeIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-wide">Home</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('calendar')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeSubView === 'calendar'
                ? 'text-white font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeSubView === 'calendar' ? 'bg-white/15' : ''}`}>
              <CalendarIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-wide">Calendar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('notices')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeSubView === 'notices'
                ? 'text-white font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeSubView === 'notices' ? 'bg-white/15' : ''}`}>
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-wide">Messages</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('profile')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeSubView === 'profile'
                ? 'text-white font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeSubView === 'profile' ? 'bg-white/15' : ''}`}>
              <UserIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-wide">Profile</span>
          </button>
        </div>
      </div>

      {/* Slide-out Menu Drawer from Hamburger Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex animate-fadeIn">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full p-5 shadow-2xl flex flex-col justify-between z-10 animate-slideRight">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-900 text-white font-black flex items-center justify-center text-xs">
                    LRA
                  </div>
                  <div>
                    <h3 className="text-xs font-black font-heading text-slate-900 dark:text-white">
                      LITTLE ROSES ACADEMY
                    </h3>
                    <p className="text-[10px] text-slate-500">Learner & Parent Hub</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Student info */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 flex items-center gap-3">
                <img
                  src={currentStudent.avatar || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=100'}
                  alt={currentStudent.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentStudent.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {currentStudent.admissionNumber} • {currentStudent.grade}
                  </p>
                </div>
              </div>

              {/* Navigation links */}
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setActiveSubView('overview');
                    setIsMenuOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-bold text-slate-700 dark:text-slate-200 text-left"
                >
                  <HomeIcon className="w-4 h-4 text-blue-600" />
                  <span>Home Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    setIsPhotoUploadOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-bold text-slate-700 dark:text-slate-200 text-left"
                >
                  <Camera className="w-4 h-4 text-rose-600" />
                  <span>Update Learner Picture</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSubView('results');
                    setIsMenuOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-bold text-slate-700 dark:text-slate-200 text-left"
                >
                  <Printer className="w-4 h-4 text-purple-600" />
                  <span>Print CBC Report Card</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSubView('calendar');
                    setIsMenuOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-bold text-slate-700 dark:text-slate-200 text-left"
                >
                  <CalendarIcon className="w-4 h-4 text-emerald-600" />
                  <span>School Calendar</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSubView('profile');
                    setIsMenuOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-bold text-slate-700 dark:text-slate-200 text-left"
                >
                  <UserIcon className="w-4 h-4 text-amber-600" />
                  <span>Learner Profile</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <WifiOff className="w-3.5 h-3.5" />
                <span>100% Offline Mode</span>
              </div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onBackToPortals();
                }}
                className="w-full p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO UPLOAD MODAL */}
      {isPhotoUploadOpen && (
        <LearnerPhotoUploadModal
          isOpen={isPhotoUploadOpen}
          onClose={() => setIsPhotoUploadOpen(false)}
          student={currentStudent}
          onPhotoUpdated={handlePhotoUpdated}
        />
      )}

      {/* FULL PROFILE DETAILS MODAL (WITHOUT FEES OR DIET) */}
      {isEditProfileOpen && (
        <LearnerEditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          student={currentStudent}
          onSuccess={(updated) => {
            setCurrentStudent(updated);
          }}
          isParentRole={!isTeacherViewing}
        />
      )}
    </div>
  );
};
