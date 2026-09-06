import React, { useState, useEffect, useMemo } from 'react';
import { 
  GradeLevel, 
  SubjectName, 
  TimetableSlot, 
  TeacherProfile,
  STANDARD_SUBJECTS 
} from '../../types';
import { 
  Printer, 
  Edit, 
  Save, 
  Plus, 
  RotateCcw, 
  Check, 
  Calendar,
  Clock,
  Sparkles,
  Coffee,
  Utensils,
  Trophy,
  User,
  GraduationCap,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Filter,
  KeyRound,
  ShieldCheck,
  Lock,
  Unlock,
  X,
  Database
} from 'lucide-react';
import { storage } from '../../services/storageService';
import { updateTimetableSlot, generateSqliteTimetableSQL } from '../../services/sqliteDb';
import { SchoolLogo } from '../SchoolLogo';
import { 
  BELL_SCHEDULE_SLOTS, 
  getCurrentBellStatus, 
  TEACHER_PROFILES,
  MASTER_TEACHER_SCHEDULE,
  BellStatusResult
} from '../../data/teacherTimetableData';

interface TimetableViewProps {
  timetable?: TimetableSlot[];
  activeTeacherProfile?: TeacherProfile;
  onSelectTeacher?: (teacher: TeacherProfile) => void;
  canEditTimetable?: boolean;
  userRole?: 'admin' | 'teacher' | 'learner';
}

const DAYS: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

const GRADES: GradeLevel[] = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'
];

// Quick simulation times for testing & demonstrations
const SIMULATED_TIMES = [
  { label: 'Live System Time', value: '' },
  { label: '8:25 AM (Lesson 1)', value: '08:25' },
  { label: '9:00 AM (Lesson 2)', value: '09:00' },
  { label: '9:40 AM (Lesson 3)', value: '09:40' },
  { label: '10:20 AM (Break)', value: '10:20' },
  { label: '10:55 AM (Lesson 4)', value: '10:55' },
  { label: '11:35 AM (Lesson 5)', value: '11:35' },
  { label: '12:15 PM (Lesson 6)', value: '12:15' },
  { label: '1:00 PM (Lunch)', value: '13:00' },
  { label: '1:35 PM (Lesson 7)', value: '13:35' },
  { label: '2:15 PM (Lesson 8)', value: '14:15' },
  { label: '3:00 PM (Games)', value: '15:00' }
];

export const TimetableView: React.FC<TimetableViewProps> = ({
  timetable: initialTimetable,
  activeTeacherProfile,
  onSelectTeacher,
  canEditTimetable: propCanEdit,
  userRole = 'teacher'
}) => {
  // Determine if editing is allowed (Admins can edit timetable, Teachers are view-only unless unlocked)
  const initialCanEdit = propCanEdit !== undefined 
    ? propCanEdit 
    : storage.canEditTimetable(userRole);

  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(initialCanEdit);
  const [showAdminUnlockModal, setShowAdminUnlockModal] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminUnlockError, setAdminUnlockError] = useState<string | null>(null);

  const canEdit = isAdminUnlocked || userRole === 'admin';

  // Currently authenticated or selected teacher
  const allTeachers = storage.getTeacherProfiles();
  const defaultTeacher = activeTeacherProfile || storage.getActiveTeacherProfile();
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile>(defaultTeacher);

  // View modes: 'timeline' (daily dynamic bell view) | 'grid' (Word-style master matrix)
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

  // Matrix filter: 'teacher' | 'grade'
  const [matrixFilterMode, setMatrixFilterMode] = useState<'teacher' | 'grade'>('teacher');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Grade 6');

  // Selected Day for daily timeline
  const todayDayName = useMemo(() => {
    const d = new Date().getDay();
    if (d >= 1 && d <= 5) return DAYS[d - 1];
    return 'Monday';
  }, []);
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>(todayDayName);

  // Time simulation for testing
  const [simulatedTime, setSimulatedTime] = useState<string>('');
  const [bellStatus, setBellStatus] = useState<BellStatusResult>(() => getCurrentBellStatus(simulatedTime));

  // Local timetable data synced from storage
  const [masterSchedule, setMasterSchedule] = useState<TimetableSlot[]>(() => {
    return storage.getMasterTeacherSchedule();
  });

  // Editing state
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editedSubject, setEditedSubject] = useState<string>('Mathematics');
  const [editedGrade, setEditedGrade] = useState<GradeLevel>('Grade 6');
  const [editedTeacher, setEditedTeacher] = useState<string>(selectedTeacher.name);
  const [editedRoom, setEditedRoom] = useState<string>('Room 6A');

  // Real-time clock update (every 10 seconds)
  useEffect(() => {
    const updateStatus = () => {
      setBellStatus(getCurrentBellStatus(simulatedTime));
    };
    updateStatus();
    const timer = setInterval(updateStatus, 10000);
    return () => clearInterval(timer);
  }, [simulatedTime]);

  // Keep selected teacher synced if prop changes
  useEffect(() => {
    if (activeTeacherProfile && activeTeacherProfile.id !== selectedTeacher.id) {
      setSelectedTeacher(activeTeacherProfile);
    }
  }, [activeTeacherProfile]);

  const handleTeacherChange = (teacher: TeacherProfile) => {
    setSelectedTeacher(teacher);
    if (onSelectTeacher) onSelectTeacher(teacher);
  };

  // Find slot for teacher or grade
  const getSlot = (day: string, periodNum: number, teacherId?: string, grade?: GradeLevel) => {
    if (matrixFilterMode === 'teacher') {
      const tId = teacherId || selectedTeacher.id;
      return masterSchedule.find(s => s.day === day && s.periodNumber === periodNum && (s.teacherId === tId || s.teacherName === selectedTeacher.name));
    } else {
      const g = grade || selectedGrade;
      return masterSchedule.find(s => s.day === day && s.periodNumber === periodNum && s.grade === g);
    }
  };

  const handleStartEdit = (slot: TimetableSlot) => {
    if (!canEdit) {
      setAdminPasswordInput('');
      setAdminUnlockError(null);
      setShowAdminUnlockModal(true);
      return;
    }
    setEditingSlotId(slot.id);
    setEditedSubject(slot.subject);
    setEditedGrade(slot.grade);
    setEditedTeacher(slot.teacherName);
    setEditedRoom(slot.room);
  };

  const handleSaveSlot = (slot: TimetableSlot) => {
    if (!canEdit) {
      setShowAdminUnlockModal(true);
      return;
    }
    const updatedSchedule = masterSchedule.map(s => {
      if (s.id === slot.id) {
        return {
          ...s,
          subject: editedSubject as any,
          grade: editedGrade,
          teacherName: editedTeacher,
          room: editedRoom
        };
      }
      return s;
    });

    setMasterSchedule(updatedSchedule);
    storage.saveMasterTeacherSchedule(updatedSchedule);

    // Synchronize to SQLite Timetable database
    updateTimetableSlot(slot.id, editedSubject, slot.timeSlot).catch((err) => {
      console.warn('SQLite timetable update warning:', err);
    });

    setEditingSlotId(null);
  };

  const handleExportSqlite = () => {
    const sql = generateSqliteTimetableSQL(masterSchedule);
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LittleRoses_Timetable_SQLite_Export_${new Date().toISOString().slice(0, 10)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetSchedule = () => {
    if (!canEdit) {
      setAdminPasswordInput('');
      setAdminUnlockError(null);
      setShowAdminUnlockModal(true);
      return;
    }
    if (window.confirm('Reset timetable back to the standard Little Roses schedule?')) {
      setMasterSchedule(MASTER_TEACHER_SCHEDULE);
      storage.saveMasterTeacherSchedule(MASTER_TEACHER_SCHEDULE);
    }
  };

  // Current active slot for the selected teacher on today's day
  const teacherTodaySlots = masterSchedule.filter(
    s => s.day === selectedDay && (s.teacherId === selectedTeacher.id || s.teacherName === selectedTeacher.name)
  );

  const activeLessonSlot = bellStatus.currentSlot && !bellStatus.currentSlot.isBreak
    ? teacherTodaySlots.find(s => s.periodNumber === bellStatus.currentSlot?.periodNumber)
    : null;

  const nextLessonSlot = bellStatus.nextSlot && !bellStatus.nextSlot.isBreak
    ? teacherTodaySlots.find(s => s.periodNumber === bellStatus.nextSlot?.periodNumber)
    : null;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* 1. TOP HEADER WITH REAL-TIME BELL BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-blue-800/80 shadow-xl relative overflow-hidden">
        {/* Background Subtle Pattern */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Clock className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Current Bell Status & Clock */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/15 text-white backdrop-blur-xs border border-white/20">
                <Clock className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
                <span>{bellStatus.formattedCurrentTime}</span>
                <span className="opacity-60">•</span>
                <span>{selectedDay}</span>
              </span>

              {/* Status Badge */}
              {bellStatus.status === 'active' && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-sm animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                  Period In Progress
                </span>
              )}
              {bellStatus.status === 'break' && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
                  <Coffee className="w-3 h-3" />
                  Recess / Break
                </span>
              )}
              {bellStatus.status === 'before-school' && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  Morning Preparation • Starts 8:10 AM
                </span>
              )}
              {bellStatus.status === 'after-school' && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-700 text-slate-300">
                  School Concluded • Evening Study
                </span>
              )}
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Little Roses Bell Timetable</span>
                <span className="text-xs font-mono font-normal bg-blue-800/80 text-blue-200 px-2 py-0.5 rounded-md border border-blue-600/50">
                  8:10 AM – 2:40 PM+
                </span>
              </h2>

              {/* Dynamic Description of Current Slot */}
              {bellStatus.currentSlot ? (
                <p className="text-xs sm:text-sm text-blue-200 mt-1 font-medium flex items-center gap-2">
                  <span>Currently in: <strong>{bellStatus.currentSlot.label}</strong> ({bellStatus.currentSlot.displayTime})</span>
                  <span className="opacity-60">•</span>
                  <span className="text-emerald-300 font-bold">{bellStatus.minutesRemaining} min remaining</span>
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-blue-200 mt-1 font-medium">
                  {bellStatus.nextSlot 
                    ? `Next bell: ${bellStatus.nextSlot.label} at ${bellStatus.nextSlot.startTime}`
                    : 'All scheduled class periods for today have completed.'}
                </p>
              )}
            </div>

            {/* Active Period Progress Bar */}
            {bellStatus.currentSlot && (
              <div className="w-full max-w-md pt-1">
                <div className="flex justify-between text-[10px] font-mono text-blue-200 mb-1">
                  <span>{bellStatus.currentSlot.startTime}</span>
                  <span>{bellStatus.percentElapsed}% Elapsed</span>
                  <span>{bellStatus.currentSlot.endTime}</span>
                </div>
                <div className="h-2 w-full bg-blue-950/80 rounded-full overflow-hidden border border-blue-700/50">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${bellStatus.percentElapsed}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right: Simulation Controller & Print Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 no-print">
            {/* Simulator dropdown */}
            <div className="flex items-center gap-2 bg-blue-950/70 p-1.5 rounded-xl border border-blue-700/60">
              <span className="text-[11px] font-bold text-blue-300 pl-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Simulate Bell:</span>
              </span>
              <select
                id="bell-time-simulator"
                value={simulatedTime}
                onChange={(e) => setSimulatedTime(e.target.value)}
                className="text-xs font-mono font-bold bg-blue-900 text-white rounded-lg px-2.5 py-1 border border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-400"
                title="Test active period highlight at different bell times"
              >
                {SIMULATED_TIMES.map((st, i) => (
                  <option key={i} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Print, Reset, and Admin Clearance Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {canEdit ? (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 rounded-xl text-xs font-bold shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Edit Mode Active</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAdminPasswordInput('');
                    setAdminUnlockError(null);
                    setShowAdminUnlockModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 rounded-xl text-xs font-bold transition-all shadow-xs"
                  title="Unlock timetable editing with administration master password"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                  <span>Unlock Admin Edit</span>
                </button>
              )}

              <button
                onClick={handleResetSchedule}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20"
                title="Reset to default schedule"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={handleExportSqlite}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600/80 hover:bg-blue-600 active:scale-95 text-white rounded-xl text-xs font-bold transition-all border border-blue-400/40 shadow-xs"
                title="Export Timetable SQLite .SQL schema & inserts"
              >
                <Database className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export SQLite</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Printer className="w-4 h-4" />
                Print Master Timetable
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TEACHER PROFILE SELECTOR TABS */}
      <div className="space-y-2 no-print">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Teacher Timetable Profiles (4 Designated Faculty)</span>
          </label>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Click to view individual teaching schedule
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {allTeachers.map((teacher) => {
            const isSelected = teacher.id === selectedTeacher.id;
            return (
              <button
                key={teacher.id}
                id={`timetable-teacher-${teacher.id}`}
                onClick={() => handleTeacherChange(teacher)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 dark:border-blue-500 bg-white dark:bg-slate-900 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${teacher.avatarColor} text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs`}>
                    {teacher.name.replace('MR ', '').replace('MADAM ', '').slice(0, 2)}
                  </div>
                  <div className="truncate">
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {teacher.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      {teacher.tscNumber}
                    </div>
                  </div>
                </div>

                {/* Subject Assignments Badges */}
                <div className="space-y-1">
                  {teacher.assignments.map((asg, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                      <span className="font-semibold truncate pr-1">{asg.subject}</span>
                      <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 py-0.2 rounded shrink-0">
                        {asg.gradeSummary}
                      </span>
                    </div>
                  ))}
                </div>

                {isSelected && (
                  <div className="mt-2 pt-1 border-t border-blue-100 dark:border-blue-900/50 flex items-center justify-between text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    <span>Active Schedule</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. VIEW MODE CONTROLS & DAY SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 no-print">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'timeline'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Today's Live Bell Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Master Weekly Matrix</span>
          </button>
        </div>

        {/* Right: Weekday Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* 4A. TIMELINE VIEW: DYNAMIC DAILY BELL TIMELINE */}
      {viewMode === 'timeline' && (
        <div className="space-y-4">
          {/* Active Period Alert Banner */}
          {activeLessonSlot ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/50 text-slate-900 dark:text-white flex items-center justify-between gap-4 shadow-sm animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded-full">
                      Live Period Now
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                      {activeLessonSlot.timeSlot}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {activeLessonSlot.subject} • {activeLessonSlot.grade} ({activeLessonSlot.room})
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Instructor: <strong>{activeLessonSlot.teacherName}</strong> • {bellStatus.minutesRemaining} minutes remaining in this period
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                  {bellStatus.percentElapsed}% Completed
                </span>
              </div>
            </div>
          ) : bellStatus.status === 'break' && bellStatus.currentSlot ? (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500/50 text-slate-900 dark:text-white flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                  {bellStatus.currentSlot.breakType === 'tea' ? <Coffee className="w-5 h-5" /> : <Utensils className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded-full">
                      School Break In Progress
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                      {bellStatus.currentSlot.displayTime}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {bellStatus.currentSlot.label === 'Break' ? 'Morning Tea Break & Fellowship' : 'Lunch Break & Refreshment'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Pupils & staff dining interval • Resumes at {bellStatus.currentSlot.endTime}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">
                  {bellStatus.minutesRemaining}m Left
                </span>
              </div>
            </div>
          ) : null}

          {/* Timeline Cards for each Bell Slot */}
          <div className="space-y-3">
            {BELL_SCHEDULE_SLOTS.map((slot) => {
              const isCurrent = bellStatus.currentSlot?.id === slot.id;
              const lessonSlot = teacherTodaySlots.find(s => s.periodNumber === slot.periodNumber);

              if (slot.isBreak) {
                return (
                  <div 
                    key={slot.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'border-amber-400 bg-amber-50/80 dark:bg-amber-950/40 shadow-sm ring-2 ring-amber-400/20'
                        : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                        {slot.breakType === 'tea' ? <Coffee className="w-4 h-4" /> : slot.breakType === 'lunch' ? <Utensils className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {slot.label === 'Break' ? 'Tea Break' : slot.label === 'Lunch' ? 'Lunch Break' : 'Games & Co-Curricular'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {slot.displayTime}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {slot.breakType === 'tea' 
                            ? 'Morning tea refreshment for all grades' 
                            : slot.breakType === 'lunch' 
                            ? 'Dining hall lunch service' 
                            : 'Sports, Physical Education & Club activities'}
                        </p>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                        ACTIVE NOW
                      </span>
                    )}
                  </div>
                );
              }

              // Normal Lesson Slot
              return (
                <div 
                  key={slot.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    {/* Left: Period Number & Time */}
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isCurrent 
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        P{slot.periodNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {slot.label}
                          </span>
                          <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/50 px-2 py-0.5 rounded">
                            {slot.displayTime}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full animate-pulse">
                              LIVE
                            </span>
                          )}
                        </div>

                        {/* Subject & Room Details */}
                        {lessonSlot ? (
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {lessonSlot.subject}
                            </span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                              {lessonSlot.grade}
                            </span>
                            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                              Room: {lessonSlot.room}
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">
                            Free Period / Remedial Supervision
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Instructor Name & Edit Trigger */}
                    <div className="flex items-center gap-2 sm:self-center">
                      {lessonSlot ? (
                        <div className="text-right mr-2 hidden sm:block">
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {lessonSlot.teacherName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Subject Specialist
                          </div>
                        </div>
                      ) : null}

                      {lessonSlot && (
                        <button
                          onClick={() => handleStartEdit(lessonSlot)}
                          className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors ${
                            canEdit
                              ? 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                              : 'border-slate-200/60 dark:border-slate-800 text-slate-400 hover:text-amber-600 hover:border-amber-300'
                          }`}
                          title={canEdit ? 'Edit slot details' : 'Click to unlock administrator editing'}
                        >
                          {canEdit ? <Edit className="w-3.5 h-3.5 text-blue-600" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                          <span>{canEdit ? 'Edit' : 'Locked'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline edit panel if active */}
                  {lessonSlot && editingSlotId === lessonSlot.id && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg animate-fade-in">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500">Subject</label>
                        <select
                          value={editedSubject}
                          onChange={(e) => setEditedSubject(e.target.value)}
                          className="w-full text-xs p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                        >
                          {STANDARD_SUBJECTS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500">Grade</label>
                        <select
                          value={editedGrade}
                          onChange={(e) => setEditedGrade(e.target.value as GradeLevel)}
                          className="w-full text-xs p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                        >
                          {GRADES.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500">Room</label>
                        <input
                          type="text"
                          value={editedRoom}
                          onChange={(e) => setEditedRoom(e.target.value)}
                          className="w-full text-xs p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      <div className="flex items-end gap-1">
                        <button
                          onClick={() => handleSaveSlot(lessonSlot)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 rounded transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSlotId(null)}
                          className="px-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs py-1.5 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4B. MATRIX VIEW: MICROSOFT WORD-STYLE MASTER DOCUMENT GRID */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          {/* Matrix Controls Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800 no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">View By:</span>
              <button
                onClick={() => setMatrixFilterMode('teacher')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  matrixFilterMode === 'teacher'
                    ? 'bg-blue-900 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Teacher: {selectedTeacher.name}
              </button>
              <button
                onClick={() => setMatrixFilterMode('grade')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  matrixFilterMode === 'grade'
                    ? 'bg-blue-900 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Class Grade
              </button>
            </div>

            {matrixFilterMode === 'grade' && (
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {GRADES.map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrade(g)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      selectedGrade === g
                        ? 'bg-blue-900 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Microsoft Word Document Sheet Container */}
          <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-xl overflow-x-auto">
            {/* Document Header (Word Header Style) */}
            <div className="border-b-2 border-slate-900 dark:border-slate-400 pb-4 mb-5 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <SchoolLogo size="sm" badgeOnly />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-wide uppercase text-slate-900 dark:text-white font-heading">
                    LITTLE ROSES ACADEMY - NAKURU
                  </h1>
                  <p className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400">
                    Official CBC Master Teaching Timetable • 2026 Academic Year
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    P.O. Box 3443 Nakuru • Phone: 0798 193966 • Email: roseslittle3@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 px-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                {matrixFilterMode === 'teacher' ? (
                  <span>FACULTY: <strong className="text-blue-900 dark:text-blue-400 uppercase">{selectedTeacher.name} ({selectedTeacher.tscNumber})</strong></span>
                ) : (
                  <span>CLASS: <strong className="text-blue-900 dark:text-blue-400 uppercase">{selectedGrade}</strong></span>
                )}
                <span>TERM: <strong className="text-slate-900 dark:text-white">TERM 1</strong></span>
                <span>BELL SLOTS: <strong className="text-slate-900 dark:text-white">8 Periods + Tea/Lunch/Games</strong></span>
                <span>HEADTEACHER: <strong className="text-slate-900 dark:text-white">Mr. Kelvin</strong></span>
              </div>
            </div>

            {/* Word Document Table Grid with all 11 slots */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-400 dark:border-slate-600 text-xs">
                <thead>
                  <tr className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-center border-b border-slate-400 dark:border-slate-600">
                    <th className="p-2 border border-slate-400 dark:border-slate-600 w-24 text-left uppercase text-[10px]">
                      Day / Period
                    </th>
                    {BELL_SCHEDULE_SLOTS.map((slot, idx) => (
                      <th 
                        key={idx} 
                        className={`p-1.5 border border-slate-400 dark:border-slate-600 ${
                          slot.isBreak 
                            ? 'bg-amber-100/80 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-bold min-w-[70px]' 
                            : 'min-w-[100px]'
                        }`}
                      >
                        <div className="font-extrabold text-[11px] leading-tight">{slot.label}</div>
                        <div className="text-[9px] font-mono font-normal opacity-85 mt-0.5">{slot.startTime}–{slot.endTime}</div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {DAYS.map((day) => (
                    <tr key={day} className="border-b border-slate-400 dark:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      {/* Day Header Column */}
                      <td className="p-2 font-black uppercase text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 text-[10px]">
                        {day}
                      </td>

                      {/* 11 Period Slots */}
                      {BELL_SCHEDULE_SLOTS.map((slot, sIdx) => {
                        if (slot.isBreak) {
                          return (
                            <td 
                              key={sIdx} 
                              className="p-1 text-center bg-amber-50/80 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 font-bold text-[9px] border border-slate-400 dark:border-slate-600 select-none uppercase tracking-wider"
                            >
                              {slot.label === 'Break' ? 'Tea Break' : slot.label === 'Lunch' ? 'Lunch' : 'Games'}
                            </td>
                          );
                        }

                        const currentSlot = getSlot(day, slot.periodNumber);
                        const isEditing = currentSlot && editingSlotId === currentSlot.id;

                        return (
                          <td 
                            key={sIdx}
                            className="p-1 border border-slate-400 dark:border-slate-600 text-center relative group min-h-[50px]"
                          >
                            {isEditing && currentSlot ? (
                              <div className="p-1.5 bg-blue-50 dark:bg-slate-800 rounded border border-blue-400 space-y-1 text-left z-20 shadow-lg">
                                <select
                                  value={editedSubject}
                                  onChange={(e) => setEditedSubject(e.target.value)}
                                  className="w-full text-[10px] p-1 rounded font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                                >
                                  {STANDARD_SUBJECTS.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                                <select
                                  value={editedGrade}
                                  onChange={(e) => setEditedGrade(e.target.value as GradeLevel)}
                                  className="w-full text-[10px] p-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold"
                                >
                                  {GRADES.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                  ))}
                                </select>
                                <input
                                  type="text"
                                  value={editedRoom}
                                  onChange={(e) => setEditedRoom(e.target.value)}
                                  placeholder="Room"
                                  className="w-full text-[10px] p-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                                />
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleSaveSlot(currentSlot)}
                                    className="flex-1 bg-emerald-600 text-white text-[10px] font-bold py-0.5 rounded"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingSlotId(null)}
                                    className="px-1.5 bg-slate-300 text-slate-800 text-[10px] rounded"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ) : currentSlot ? (
                              <div 
                                onClick={() => handleStartEdit(currentSlot)}
                                className="cursor-pointer hover:bg-blue-100/70 dark:hover:bg-blue-950/50 p-1 rounded transition-colors group"
                                title="Click to edit lesson slot"
                              >
                                <div className="font-black text-[11px] text-slate-900 dark:text-white leading-tight">
                                  {currentSlot.subject}
                                </div>
                                <div className="text-[10px] font-bold text-blue-800 dark:text-blue-300">
                                  {currentSlot.grade}
                                </div>
                                <div className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                                  {currentSlot.room}
                                </div>
                              </div>
                            ) : (
                              <div className="py-2 text-[10px] text-slate-300 dark:text-slate-600">
                                —
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Word Document Footer & Official Sign-off */}
            <div className="mt-8 pt-4 border-t-2 border-slate-900 dark:border-slate-400 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
              <div>
                <p className="text-[10px] uppercase text-slate-400">Timetable Master:</p>
                <p className="font-extrabold mt-1 text-slate-900 dark:text-white">{selectedTeacher.name}</p>
                <p className="text-[10px] font-serif italic text-slate-500 font-normal">Faculty Coordinator</p>
              </div>
              <div className="text-left sm:text-center">
                <p className="text-[10px] uppercase text-slate-400">Approved & Verified By:</p>
                <p className="font-extrabold mt-1 text-slate-900 dark:text-white">Mr. Kelvin</p>
                <p className="text-[10px] font-serif italic text-slate-500 font-normal">Headteacher, Little Roses Academy</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[10px] uppercase text-slate-400">Ministry Compliance:</p>
                <div className="inline-block mt-1 px-3 py-1 border-2 border-dashed border-rose-600 text-rose-700 dark:text-rose-400 text-[10px] uppercase font-black rounded-lg">
                  ★ MOE & CBC APPROVED SCHEDULE ★
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
