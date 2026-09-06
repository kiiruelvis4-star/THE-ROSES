import React, { useState, useEffect } from 'react';
import { 
  AppScreen, 
  UserRole, 
  Student, 
  SchemeOfWork, 
  LessonPlan, 
  RecordOfWork, 
  Assignment, 
  Quiz, 
  ResourceItem, 
  TimetableSlot, 
  CalendarEvent 
} from './types';
import { storage } from './services/storageService';
import { SplashScreen } from './components/SplashScreen';
import { PortalSelectScreen } from './components/PortalSelectScreen';
import { TopAppBar } from './components/TopAppBar';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { LearnerDashboard } from './components/learner/LearnerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { ExitAppModal } from './components/common/ExitAppModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [activeRole, setActiveRole] = useState<UserRole>('teacher');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => storage.getActiveStudentId());
  const [isTeacherInspectingLearner, setIsTeacherInspectingLearner] = useState<boolean>(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') || 
      localStorage.getItem('little_roses_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
      localStorage.setItem('little_roses_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('dark');
      localStorage.setItem('little_roses_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleThemeStorage = (e: StorageEvent) => {
      if (e.key === 'little_roses_theme' && e.newValue) {
        setIsDarkMode(e.newValue === 'dark');
      }
    };
    window.addEventListener('storage', handleThemeStorage);
    return () => window.removeEventListener('storage', handleThemeStorage);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Reactive state synced from localStorage
  const [students, setStudents] = useState<Student[]>(storage.getStudents());
  const [schemes, setSchemes] = useState<SchemeOfWork[]>(storage.getSchemes());
  const [lessons, setLessons] = useState<LessonPlan[]>(storage.getLessonPlans());
  const [records, setRecords] = useState<RecordOfWork[]>(storage.getRecordsOfWork());
  const [assignments, setAssignments] = useState<Assignment[]>(storage.getAssignments());
  const [quizzes, setQuizzes] = useState<Quiz[]>(storage.getQuizzes());
  const [resources, setResources] = useState<ResourceItem[]>(storage.getResources());
  const [timetable, setTimetable] = useState<TimetableSlot[]>(storage.getTimetable());
  const [events, setEvents] = useState<CalendarEvent[]>(storage.getCalendarEvents());

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setStudents(storage.getStudents());
      setSchemes(storage.getSchemes());
      setLessons(storage.getLessonPlans());
      setRecords(storage.getRecordsOfWork());
      setAssignments(storage.getAssignments());
      setQuizzes(storage.getQuizzes());
      setResources(storage.getResources());
      setTimetable(storage.getTimetable());
      setEvents(storage.getCalendarEvents());
    });

    return () => unsubscribe();
  }, []);

  // Hardware Back Button & Mobile Browser Back Action Handler
  useEffect(() => {
    // Push an initial history entry to enable intercepting the hardware back button
    window.history.pushState({ page: 'eduhub' }, '');

    const handlePopState = () => {
      // If user is already on portal select or splash, show exit confirmation dialog
      if (currentScreen === 'portal-select' || currentScreen === 'splash') {
        setIsExitModalOpen(true);
        window.history.pushState({ page: 'eduhub' }, '');
      } else {
        // Return back to portal selection
        setCurrentScreen('portal-select');
        window.history.pushState({ page: 'eduhub' }, '');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentScreen]);

  // Handle Splash Complete
  const handleSplashFinish = () => {
    setCurrentScreen('portal-select');
  };

  // Handle Portal Selection
  const handleSelectPortal = (role: UserRole, studentId?: string) => {
    setActiveRole(role);
    setIsTeacherInspectingLearner(false);
    if (studentId) {
      setSelectedStudentId(studentId);
    }
    setCurrentScreen(role === 'teacher' ? 'teacher' : role === 'admin' ? 'admin' : 'learner');
  };

  // Teacher selects a student to inspect their individual Learner Dashboard
  const handleTeacherInspectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsTeacherInspectingLearner(true);
    setCurrentScreen('learner');
  };

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. SPLASH SCREEN (0-100% Animated Progress Bar) */}
      {currentScreen === 'splash' && (
        <SplashScreen onComplete={handleSplashFinish} onFinish={handleSplashFinish} />
      )}

      {/* 2. PORTAL SELECTION SCREEN (Navy Blue Teacher & Red Learner) */}
      {currentScreen === 'portal-select' && (
        <div className="min-h-screen flex flex-col">
          <TopAppBar
            activeRole={null}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onSwitchRole={(role) => role && handleSelectPortal(role, selectedStudentId)}
            onSwitchPortal={(role) => handleSelectPortal(role, selectedStudentId)}
            onGoHome={() => setCurrentScreen('portal-select')}
          />
          <div className="flex-1">
            <PortalSelectScreen
              students={students}
              onSelectPortal={handleSelectPortal}
              onSelectRole={handleSelectPortal}
            />
          </div>
        </div>
      )}

      {/* 3. TEACHER DASHBOARD */}
      {currentScreen === 'teacher' && (
        <div className="min-h-screen flex flex-col">
          <TopAppBar
            activeRole="teacher"
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onSwitchRole={(role) => handleSelectPortal(role || 'learner', selectedStudentId)}
            onSwitchPortal={(role) => handleSelectPortal(role, selectedStudentId)}
            onGoHome={() => setCurrentScreen('portal-select')}
          />
          <main className="flex-1">
            <TeacherDashboard
              students={students}
              schemes={schemes}
              lessons={lessons}
              records={records}
              assignments={assignments}
              quizzes={quizzes}
              resources={resources}
              timetable={timetable}
              events={events}
              onOpenLearnerDashboard={handleTeacherInspectStudent}
              onBackToPortals={() => setCurrentScreen('portal-select')}
            />
          </main>
        </div>
      )}

      {/* 4. LEARNER DASHBOARD */}
      {currentScreen === 'learner' && currentStudent && (
        <div className="min-h-screen flex flex-col">
          <TopAppBar
            activeRole="learner"
            studentName={currentStudent.name}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onSwitchRole={(role) => handleSelectPortal(role || 'teacher')}
            onSwitchPortal={(role) => handleSelectPortal(role)}
            onGoHome={() => {
              if (isTeacherInspectingLearner) {
                setCurrentScreen('teacher');
                setIsTeacherInspectingLearner(false);
              } else {
                setCurrentScreen('portal-select');
              }
            }}
          />
          <main className="flex-1">
            <LearnerDashboard
              student={currentStudent}
              allStudents={students}
              assignments={assignments}
              quizzes={quizzes}
              resources={resources}
              events={events}
              onSwitchStudent={(id) => setSelectedStudentId(id)}
              onBackToPortals={() => {
                if (isTeacherInspectingLearner) {
                  setCurrentScreen('teacher');
                  setIsTeacherInspectingLearner(false);
                } else {
                  setCurrentScreen('portal-select');
                }
              }}
              isTeacherViewing={isTeacherInspectingLearner}
            />
          </main>
        </div>
      )}

      {/* 5. ADMINISTRATION DASHBOARD */}
      {currentScreen === 'admin' && (
        <div className="min-h-screen flex flex-col">
          <TopAppBar
            activeRole="admin"
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onSwitchRole={(role) => role && handleSelectPortal(role, selectedStudentId)}
            onSwitchPortal={(role) => handleSelectPortal(role, selectedStudentId)}
            onGoHome={() => setCurrentScreen('portal-select')}
          />
          <main className="flex-1">
            <AdminDashboard
              students={students}
              setStudents={setStudents}
              schemes={schemes}
              onOpenLearner={handleTeacherInspectStudent}
              onSwitchPortal={(role) => handleSelectPortal(role, selectedStudentId)}
              onBackToPortals={() => setCurrentScreen('portal-select')}
            />
          </main>
        </div>
      )}

      {/* 6. Offline Connectivity Toast */}
      <OfflineIndicator />

      {/* 7. Mobile Hardware Back Button Exit Confirmation Modal */}
      <ExitAppModal
        isOpen={isExitModalOpen}
        onStay={() => setIsExitModalOpen(false)}
        onExit={() => {
          setIsExitModalOpen(false);
          setCurrentScreen('splash');
        }}
      />
    </div>
  );
}

