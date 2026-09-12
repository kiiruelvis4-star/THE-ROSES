import React, { useState } from 'react';
import { 
  TeacherTab, 
  Student, 
  SchemeOfWork, 
  LessonPlan, 
  RecordOfWork, 
  Assignment, 
  Quiz, 
  ResourceItem, 
  TimetableSlot, 
  CalendarEvent,
  TeacherProfile
} from '../../types';
import { 
  Users, 
  BookOpen, 
  Award, 
  FileCheck, 
  HelpCircle, 
  FolderOpen, 
  Clock, 
  Calendar, 
  Plus, 
  Sparkles,
  Layers,
  Search,
  ExternalLink,
  Settings,
  UploadCloud,
  FileSpreadsheet,
  KeyRound,
  ShieldCheck,
  RotateCcw,
  Lock,
  Upload,
  FileText
} from 'lucide-react';
import { MyClassesView } from './MyClassesView';
import { SchemesAndLessonsView } from './SchemesAndLessonsView';
import { AssessmentsManager } from './AssessmentsManager';
import { AssignmentsManager } from './AssignmentsManager';
import { QuizBuilder } from './QuizBuilder';
import { ResourcesManager } from './ResourcesManager';
import { TimetableView } from './TimetableView';
import { CalendarView } from '../common/CalendarView';
import { KNECProjectsSyncManager } from './KNECProjectsSyncManager';
import { ExamSeriesManager } from './ExamSeriesManager';
import { UnifiedTeacherActionModal, UnifiedTeacherActionType } from '../modals/UnifiedTeacherActionModal';
import { SchoolConfigModal } from '../modals/SchoolConfigModal';
import { LearnerQuizZoneView } from '../learner/LearnerQuizZoneView';
import { TeacherAuthModal } from './TeacherAuthModal';
import { storage } from '../../services/storageService';

interface TeacherDashboardProps {
  students: Student[];
  schemes: SchemeOfWork[];
  lessons: LessonPlan[];
  records: RecordOfWork[];
  assignments: Assignment[];
  quizzes: Quiz[];
  resources: ResourceItem[];
  timetable: TimetableSlot[];
  events: CalendarEvent[];
  onOpenLearnerDashboard: (studentId: string) => void;
  onBackToPortals: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  schemes,
  lessons,
  records,
  assignments,
  quizzes,
  resources,
  timetable,
  events,
  onOpenLearnerDashboard,
  onBackToPortals
}) => {
  const [activeTab, setActiveTab] = useState<TeacherTab>('classes');
  const [crudModalType, setCrudModalType] = useState<UnifiedTeacherActionType | null>(null);
  const [editingItemData, setEditingItemData] = useState<any>(null);
  const [previewQuiz, setPreviewQuiz] = useState<Quiz | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [systemConfig, setSystemConfig] = useState(() => storage.getSystemConfig());

  const knecProjects = storage.getKNECProjects();
  const examSeries = storage.getExamSeries();
  const [activeTeacher, setActiveTeacher] = useState<TeacherProfile>(() => storage.getActiveTeacherProfile());
  const [isTeacherAuthModalOpen, setIsTeacherAuthModalOpen] = useState(false);

  const TABS = [
    { id: 'classes' as TeacherTab, label: 'My Classes', icon: Users, count: students.length },
    { id: 'knec' as TeacherTab, label: 'KNEC CBA Sync', icon: UploadCloud, count: knecProjects.length },
    { id: 'exams' as TeacherTab, label: 'Exam Series', icon: Award, count: examSeries.length },
    { id: 'schemes' as TeacherTab, label: 'Schemes & Lessons', icon: BookOpen, count: schemes.length + lessons.length },
    { id: 'assessments' as TeacherTab, label: 'CATs & Assessments', icon: FileSpreadsheet },
    { id: 'assignments' as TeacherTab, label: 'Assignments', icon: FileCheck, count: assignments.length },
    { id: 'quizzes' as TeacherTab, label: 'Quiz Zone', icon: HelpCircle, count: quizzes.length },
    { id: 'timetable' as TeacherTab, label: 'My Timetable', icon: Clock },
    { id: 'calendar' as TeacherTab, label: 'Calendar', icon: Calendar }
  ];

  const handleOpenCreate = (type: UnifiedTeacherActionType) => {
    setEditingItemData(null);
    setCrudModalType(type);
    setIsSpeedDialOpen(false);
  };

  const handleOpenEdit = (type: UnifiedTeacherActionType, item: any) => {
    setEditingItemData(item);
    setCrudModalType(type);
  };

  // When + button is clicked, toggle the action menu
  const handleFloatingAction = () => {
    setIsSpeedDialOpen(prev => !prev);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
      {/* Official Teacher Profile & Authentication Banner */}
      <div 
        id="active-teacher-profile-banner"
        className="mb-6 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 no-print"
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl ${activeTeacher.avatarColor} text-white flex items-center justify-center font-black text-base shadow-md shrink-0`}>
            {activeTeacher.name.replace('MR ', '').replace('MADAM ', '').slice(0, 2)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {activeTeacher.name}
              </h1>
              <span className="text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                {activeTeacher.tscNumber}
              </span>
              <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Master Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {activeTeacher.role}
            </p>
            {/* Assigned subjects badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {activeTeacher.assignments.map((asg, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700"
                >
                  <strong className="text-slate-900 dark:text-white">{asg.subject}:</strong> {asg.gradeSummary}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 md:self-center">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Device Bound</span>
          </div>
          <button
            id="lock-teacher-device-btn"
            onClick={onBackToPortals}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 hover:text-rose-600 dark:text-slate-200 dark:hover:text-rose-400 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-2xs"
            title="Lock session and return to security portal"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Session</span>
          </button>
        </div>
      </div>

      {/* Teacher Top Sub-Bar with Tabs & System Config Trigger */}
      <div className="mb-6 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-2 no-print">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setPreviewQuiz(null);
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick System Config Button */}
        <button
          onClick={() => setIsConfigModalOpen(true)}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
          title="Configure School Metadata, Active Year & Term"
        >
          <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline">System Config</span>
        </button>
      </div>

      {/* QUIZ TEST PREVIEW OVERLAY IF ACTIVE */}
      {previewQuiz && (
        <div className="mb-6">
          <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-between mb-4">
            <span>Interactive Quiz Test Play Mode: {previewQuiz.title}</span>
            <button
              onClick={() => setPreviewQuiz(null)}
              className="px-3 py-1 bg-white text-emerald-950 rounded-lg text-xs font-bold"
            >
              Exit Preview
            </button>
          </div>
          <LearnerQuizZoneView
            student={students[0]}
            quizzes={[previewQuiz]}
            onBack={() => setPreviewQuiz(null)}
          />
        </div>
      )}

      {/* TAB CONTENT VIEWS */}
      {!previewQuiz && (
        <>
          {activeTab === 'classes' && (
            <MyClassesView
              students={students}
              onSelectStudent={onOpenLearnerDashboard}
              onAddNewStudent={() => handleOpenCreate('student')}
              onEditStudent={(st) => handleOpenEdit('student', st)}
            />
          )}

          {activeTab === 'knec' && (
            <KNECProjectsSyncManager
              onSelectLearner={onOpenLearnerDashboard}
            />
          )}

          {activeTab === 'exams' && (
            <ExamSeriesManager
              onOpenAssessments={() => setActiveTab('assessments')}
            />
          )}

          {activeTab === 'schemes' && (
            <SchemesAndLessonsView
              schemes={schemes}
              lessons={lessons}
              records={records}
              onOpenCreateModal={(t) => handleOpenCreate(t)}
              onOpenEditModal={(t, item) => handleOpenEdit(t, item)}
            />
          )}

          {activeTab === 'assessments' && (
            <AssessmentsManager
              students={students}
              onOpenLearnerDashboard={onOpenLearnerDashboard}
            />
          )}

          {activeTab === 'assignments' && (
            <AssignmentsManager
              assignments={assignments}
              onOpenCreateModal={() => handleOpenCreate('assignment')}
              onOpenEditModal={(asg) => handleOpenEdit('assignment', asg)}
            />
          )}

          {activeTab === 'quizzes' && (
            <QuizBuilder
              quizzes={quizzes}
              onOpenCreateQuizModal={() => handleOpenCreate('quiz')}
              onOpenEditQuizModal={(qz) => handleOpenEdit('quiz', qz)}
              onTakeQuizPreview={(qz) => setPreviewQuiz(qz)}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableView 
              timetable={timetable} 
              activeTeacherProfile={activeTeacher}
              onSelectTeacher={(t) => {
                setActiveTeacher(t);
                storage.setAuthenticatedTeacherId(t.id);
              }}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              events={events}
              isTeacher={true}
              onOpenAddEventModal={() => handleOpenCreate('event')}
            />
          )}
        </>
      )}

      {/* FLOATING ACTION SPEED DIAL MENU */}
      {isSpeedDialOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2.5 animate-fadeIn no-print">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-1 w-64">
            <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Quick Teacher Action
              </span>
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                + Create / Add
              </span>
            </div>

            {/* 1. UPLOAD DOCUMENT (PRIMARY USER REQUEST) */}
            <button
              onClick={() => handleOpenCreate('upload')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-black text-slate-800 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-900 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-extrabold truncate">Upload Document</div>
                <div className="text-[10px] text-slate-400 font-medium">PDF, Word, CATs, Schemes</div>
              </div>
            </button>

            {/* 2. RAW DATA & LIVE CLOCK (PRIMARY USER REQUEST) */}
            <button
              onClick={() => handleOpenCreate('raw')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-black text-slate-800 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-900 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-extrabold truncate">Raw Data & Live Clock</div>
                <div className="text-[10px] text-slate-400 font-medium">Direct input & templates</div>
              </div>
            </button>

            {/* 3. SCHEME OF WORK */}
            <button
              onClick={() => handleOpenCreate('scheme')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-black text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:bg-slate-700 group-hover:text-white transition-colors shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-extrabold truncate">Scheme of Work</div>
                <div className="text-[10px] text-slate-400 font-medium">10-column KICD builder</div>
              </div>
            </button>

            {/* 4. LESSON PLAN */}
            <button
              onClick={() => handleOpenCreate('lesson')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-black text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-extrabold truncate">Lesson Plan Sheet</div>
                <div className="text-[10px] text-slate-400 font-medium">35-minute CBE structure</div>
              </div>
            </button>

            {/* 5. CAT / ASSESSMENT */}
            <button
              onClick={() => handleOpenCreate('cat')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-black text-slate-800 dark:text-white hover:bg-amber-50 dark:hover:bg-amber-950/60 hover:text-amber-900 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-extrabold truncate">CAT / Exam Paper</div>
                <div className="text-[10px] text-slate-400 font-medium">Create & calendar schedule</div>
              </div>
            </button>

            {/* 6. CALENDAR EVENT */}
            <button
              onClick={() => handleOpenCreate('event')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-black text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-extrabold truncate">Calendar Event</div>
                <div className="text-[10px] text-slate-400 font-medium">Academic schedule</div>
              </div>
            </button>

            {/* 7. ENROLL LEARNER */}
            <button
              onClick={() => handleOpenCreate('student')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-black text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-extrabold truncate">Enroll Learner</div>
                <div className="text-[10px] text-slate-400 font-medium">New student registration</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* FLOATING + ACTION BUTTON (Available on all teacher views) */}
      <button
        onClick={handleFloatingAction}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 active:scale-95 flex items-center justify-center group no-print ${
          isSpeedDialOpen
            ? 'bg-rose-600 hover:bg-rose-500 text-white rotate-45 scale-105'
            : 'bg-blue-900 hover:bg-blue-800 text-white hover:scale-110 shadow-blue-900/40'
        }`}
        title={isSpeedDialOpen ? 'Close Menu' : 'Quick Add / Upload Action'}
        aria-label="Create New Entry"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
        {!isSpeedDialOpen && (
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pl-0 group-hover:pl-2">
            Add / Upload
          </span>
        )}
      </button>

      {/* UNIFIED TEACHER ACTION MODAL (Supports Upload, Raw Data, Schemes, Lessons, CATs, Events, Students) */}
      <UnifiedTeacherActionModal
        isOpen={crudModalType !== null}
        initialType={crudModalType as UnifiedTeacherActionType}
        initialData={editingItemData}
        onClose={() => {
          setCrudModalType(null);
          setEditingItemData(null);
        }}
      />

      {/* SCHOOL CONFIG MODAL */}
      <SchoolConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={systemConfig}
        onConfigUpdated={(newCfg) => setSystemConfig(newCfg)}
      />

      {/* TEACHER PROFILE AUTHENTICATION & SWITCH MODAL */}
      <TeacherAuthModal
        isOpen={isTeacherAuthModalOpen}
        onClose={() => setIsTeacherAuthModalOpen(false)}
        onSuccess={(teacher) => {
          setActiveTeacher(teacher);
          storage.setAuthenticatedTeacherId(teacher.id);
          setIsTeacherAuthModalOpen(false);
        }}
        preselectedTeacherId={activeTeacher.id}
      />
    </div>
  );
};
