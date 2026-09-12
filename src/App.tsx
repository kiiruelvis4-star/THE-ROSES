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
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LearnerDashboard } from './components/learner/LearnerDashboard';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { ExitAppModal } from './components/common/ExitAppModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [activeRole, setActiveRole] = useState<UserRole>('teacher');
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
    window.history.pushState({ page: 'eduhub' }, '');

    const handlePopState = () => {
      if (currentScreen === 'portal-select' || currentScreen === 'splash') {
        setIsExitModalOpen(true);
        window.history.pushState({ page: 'eduhub' }, '');
      } else {
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

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(() => {
    const list = storage.getStudents();
    return list.length > 0 ? list[0].id : null;
  });
  const [isTeacherViewingLearner, setIsTeacherViewingLearner] = useState(false);

  // Handle Portal Selection
  const handleSelectPortal = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'learner' || role === 'parent') {
      setIsTeacherViewingLearner(false);
      setCurrentScreen('learner');
    } else if (role === 'admin') {
      setCurrentScreen('admin');
    } else {
      setCurrentScreen('teacher');
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudentId(student.id);
    setActiveRole('learner');
    setIsTeacherViewingLearner(false);
    setCurrentScreen('learner');
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0] || null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. SPLASH SCREEN */}
      {currentScreen === 'splash' && (
        <SplashScreen onComplete={handleSplashFinish} onFinish={handleSplashFinish} />
      )}

      {/* 2. PORTAL SELECTION SCREEN (Admin & Teacher Only) */}
      {currentScreen === 'portal-select' && (
        <div className="min-h-screen flex flex-col">
          <TopAppBar
            activeRole={null}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onGoHome={() => setCurrentScreen('portal-select')}
          />
          <main className="flex-1 p-4 max-w-md mx-auto w-full flex flex-col justify-center">
            <PortalSelectScreen
              students={students}
              onSelectPortal={handleSelectPortal}
              onSelectRole={handleSelectPortal}
              onSelectStudent={handleSelectStudent}
            />
          </main>
        </div>
      )}

      {/* 3. TEACHER DASHBOARD */}
      {currentScreen === 'teacher' && (
        <div className="min-h-screen flex flex-col">
          <TopAppBar
            activeRole="teacher"
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onGoHome={() => setCurrentScreen('portal-select')}
            onSignOut={() => setCurrentScreen('portal-select')}
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
              onOpenLearnerDashboard={(studentId) => {
                setSelectedStudentId(studentId);
                setIsTeacherViewingLearner(true);
                setCurrentScreen('learner');
              }}
              onBackToPortals={() => setCurrentScreen('portal-select')}
            />
          </main>
        </div>
      )}

      {/* 4. ADMINISTRATION DASHBOARD */}
      {currentScreen === 'admin' && (
        <div className="min-h-screen flex flex-col">
          <TopAppBar
            activeRole="admin"
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onGoHome={() => setCurrentScreen('portal-select')}
            onSignOut={() => setCurrentScreen('portal-select')}
          />
          <main className="flex-1">
            <AdminDashboard
              students={students}
              setStudents={setStudents}
              schemes={schemes}
              onBackToPortals={() => setCurrentScreen('portal-select')}
            />
          </main>
        </div>
      )}

      {/* 5. PARENT & LEARNER DASHBOARD */}
      {currentScreen === 'learner' && selectedStudent && (
        <div className="min-h-screen flex flex-col">
          <TopAppBar
            activeRole="learner"
            title="LITTLE ROSES ACADEMY"
            subtitle={`Parent & Learner Portal • ${selectedStudent.name} (${selectedStudent.grade})`}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onGoHome={() => setCurrentScreen('portal-select')}
            onSignOut={() => {
              if (isTeacherViewingLearner) {
                setCurrentScreen('teacher');
                setIsTeacherViewingLearner(false);
              } else {
                setCurrentScreen('portal-select');
              }
            }}
          />
          <main className="flex-1">
            <LearnerDashboard
              student={selectedStudent}
              allStudents={students}
              assignments={assignments}
              quizzes={quizzes}
              resources={resources}
              events={events}
              onSwitchStudent={(id) => setSelectedStudentId(id)}
              onBackToPortals={() => {
                if (isTeacherViewingLearner) {
                  setCurrentScreen('teacher');
                  setIsTeacherViewingLearner(false);
                } else {
                  setCurrentScreen('portal-select');
                }
              }}
              isTeacherViewing={isTeacherViewingLearner}
            />
          </main>
        </div>
      )}

      {/* 5. Offline Connectivity Toast */}
      <OfflineIndicator />

      {/* 6. Mobile Hardware Back Button Exit Confirmation Modal */}
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
