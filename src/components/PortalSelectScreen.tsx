import React, { useState } from 'react';
import { SchoolLogo } from './SchoolLogo';
import { 
  UserCheck, 
  GraduationCap, 
  BookOpen, 
  Shield, 
  Sparkles, 
  ChevronRight, 
  Award, 
  Users, 
  CheckCircle, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Building2,
  Download,
  Smartphone,
  FolderArchive
} from 'lucide-react';
import { Student, TeacherProfile } from '../types';
import { storage } from '../services/storageService';
import { TeacherAuthModal } from './teacher/TeacherAuthModal';
import { AdminAuthModal } from './admin/AdminAuthModal';
import { DownloadAppModal } from './common/DownloadAppModal';

interface PortalSelectScreenProps {
  onSelectRole?: (role: 'teacher' | 'learner' | 'admin', studentId?: string) => void;
  onSelectPortal?: (role: 'teacher' | 'learner' | 'admin', studentId?: string) => void;
  students: Student[];
}

export const PortalSelectScreen: React.FC<PortalSelectScreenProps> = ({
  onSelectRole,
  onSelectPortal,
  students
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(storage.getActiveStudentId());
  const [isTeacherAuthOpen, setIsTeacherAuthOpen] = useState<boolean>(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const sysConfig = storage.getSystemConfig();
  const poBox = sysConfig?.school_metadata?.po_box || 'P.O. Box 3443 NAKURU';

  const handleRoleSelection = (role: 'teacher' | 'learner' | 'admin', studentId?: string) => {
    if (studentId) {
      storage.setActiveStudentId(studentId);
    }
    if (typeof onSelectPortal === 'function') {
      onSelectPortal(role, studentId);
    }
    if (typeof onSelectRole === 'function') {
      onSelectRole(role, studentId);
    }
  };

  const handleTeacherClick = () => {
    if (storage.isTeacherAuthenticated()) {
      handleRoleSelection('teacher');
    } else {
      setIsTeacherAuthOpen(true);
    }
  };

  const handleAdminClick = () => {
    if (storage.isAdminAuthenticated()) {
      handleRoleSelection('admin');
    } else {
      setIsAdminAuthOpen(true);
    }
  };

  const handleTeacherAuthSuccess = (teacher: TeacherProfile) => {
    setIsTeacherAuthOpen(false);
    storage.setAuthenticatedTeacherId(teacher.id);
    handleRoleSelection('teacher');
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthOpen(false);
    handleRoleSelection('admin');
  };

  const handleSelectLearner = (studentId?: string) => {
    handleRoleSelection('learner', studentId);
  };

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 transition-colors">
      <div className="max-w-md w-full mx-auto my-auto flex flex-col items-center text-center">
        {/* School Logo */}
        <div className="relative mb-4">
          <SchoolLogo size="xl" badgeOnly />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-heading">
          LITTLE ROSES <span className="text-rose-600 dark:text-rose-500">EDUHUB</span>
        </h1>

        <p className="text-xs font-bold tracking-[0.2em] text-slate-600 dark:text-slate-400 uppercase mt-1">
          CBC • TEACH • ASSESS • EXCEL
        </p>

        {/* Motto Ribbon */}
        <div className="inline-flex items-center gap-2 mt-3 mb-6 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span className="text-xs italic font-serif text-rose-700 dark:text-rose-300 font-semibold">
            "Much from Little"
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        </div>

        {/* Portals Selection Card Container - 3 DASHBOARDS */}
        <div className="w-full space-y-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Dashboard Portal (3 Portals Available)
          </p>

          {/* 1. TEACHER PORTAL BUTTON (Navy Blue) */}
          <button
            id="portal-select-teacher-btn"
            onClick={handleTeacherClick}
            className="w-full group relative overflow-hidden flex items-center justify-between p-4 sm:p-5 bg-[#172554] hover:bg-[#1e3a8a] text-white rounded-2xl shadow-lg shadow-blue-950/20 border-2 border-blue-800/80 transition-all transform active:scale-[0.98] text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/60 border border-blue-400/40 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-wide font-heading">TEACHER</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/20">
                    STAFF PORTAL
                  </span>
                </div>
                <p className="text-xs text-blue-200/80 mt-0.5">
                  Schemes, Timetable, CAT Grading & Records
                </p>
                <p className="text-[10px] text-blue-300/70 mt-1 font-medium">
                  Faculty: Mr. Elvis • Madam Fresiah • Mr. Kelvin • Madam Liz
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>

          {/* 2. LEARNER PORTAL BUTTON (Red) */}
          <button
            onClick={() => handleSelectLearner(selectedStudentId)}
            className="w-full group relative overflow-hidden flex items-center justify-between p-4 sm:p-5 bg-[#b91c1c] hover:bg-[#dc2626] text-white rounded-2xl shadow-lg shadow-red-950/20 border-2 border-rose-500/80 transition-all transform active:scale-[0.98] text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-700/80 border border-rose-400/40 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-wide font-heading">LEARNER</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-rose-100 border border-white/20">
                    PUPIL PORTAL
                  </span>
                </div>
                <p className="text-xs text-rose-100/90 mt-0.5">
                  Subjects, Quizzes, Progress & Results Card
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>

          {/* 3. ADMINISTRATION PORTAL BUTTON (Emerald Green) */}
          <button
            onClick={handleAdminClick}
            className="w-full group relative overflow-hidden flex items-center justify-between p-4 sm:p-5 bg-[#065f46] hover:bg-[#047857] text-white rounded-2xl shadow-lg shadow-emerald-950/20 border-2 border-emerald-500/80 transition-all transform active:scale-[0.98] text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-wide font-heading">ADMINISTRATION</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-emerald-100 border border-white/20">
                    MANAGEMENT HUB
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 mt-0.5">
                  Staff Directory, Enrollment, PO Box & Settings
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>

          {/* Learner Profile Selector Preview */}
          <div className="mt-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                Active Learner Profile:
              </span>
              <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                {currentStudent?.grade}
              </span>
            </div>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                storage.setActiveStudentId(e.target.value);
              }}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {students.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.name} ({std.grade} • {std.admissionNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Download App Directly Hero Card */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-xl shadow-emerald-950/20 text-left border border-emerald-400/30">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-inner">
                  <Download className="w-5 h-5 text-white animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm tracking-tight">DOWNLOAD APP DIRECTLY</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/20 text-white uppercase">v2.0 • ZIP, APK &amp; PWA</span>
                  </div>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Download full app ZIP (2.5 MB), Android APK (847 KB), or install on phone/PC for 100% offline access.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-white/20">
              <a
                href="/LittleRosesEduHub-source.zip"
                download="LittleRosesEduHub-v2.0-source.zip"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 text-center"
              >
                <FolderArchive className="w-4 h-4 text-slate-950" />
                <span>Download App ZIP</span>
              </a>
              <a
                href="/LittleRosesEduHub.apk"
                download="LittleRosesEduHub.apk"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 text-center"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                <span>Download APK</span>
              </a>
              <button
                onClick={() => setIsDownloadModalOpen(true)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-950/40 hover:bg-emerald-950/60 text-white rounded-xl font-bold text-xs border border-white/20 transition-all active:scale-95 text-center"
              >
                <Smartphone className="w-4 h-4" />
                <span>Install Guide</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 gap-2 w-full mt-6 text-left">
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
              CBC Grade 1–6 Standard
            </span>
          </div>
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
              Auto CAT Sync & Grading
            </span>
          </div>
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
              Interactive Timetable
            </span>
          </div>
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
              100% Offline Ready
            </span>
          </div>
        </div>
      </div>

      {/* Footer info with PO Box 3443 NAKURU */}
      <div className="max-w-md w-full mx-auto text-center pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        Little Roses Academy • {poBox} • roseslittle3@gmail.com • 0798 193966
      </div>

      {/* Master Teacher Authentication Modal */}
      <TeacherAuthModal
        isOpen={isTeacherAuthOpen}
        onClose={() => setIsTeacherAuthOpen(false)}
        onSuccess={handleTeacherAuthSuccess}
      />

      {/* Administration Master Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Direct App Download Modal */}
      <DownloadAppModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};
