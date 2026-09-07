import React, { useState, useEffect } from 'react';
import { SchoolLogo } from './SchoolLogo';
import { 
  UserCheck, 
  ShieldCheck, 
  ChevronRight, 
  Award, 
  Building2,
  Lock,
  Smartphone,
  Fingerprint,
  BookOpen
} from 'lucide-react';
import { Student, TeacherProfile, DeviceActivationInfo } from '../types';
import { storage } from '../services/storageService';
import { TeacherAuthModal } from './teacher/TeacherAuthModal';
import { AdminAuthModal } from './admin/AdminAuthModal';

interface PortalSelectScreenProps {
  onSelectRole?: (role: 'teacher' | 'admin') => void;
  onSelectPortal?: (role: 'teacher' | 'admin') => void;
  students?: Student[];
}

export const PortalSelectScreen: React.FC<PortalSelectScreenProps> = ({
  onSelectRole,
  onSelectPortal
}) => {
  const [isTeacherAuthOpen, setIsTeacherAuthOpen] = useState<boolean>(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState<boolean>(false);
  const [deviceActivation, setDeviceActivation] = useState<DeviceActivationInfo | null>(() => storage.getDeviceActivation());
  
  const sysConfig = storage.getSystemConfig();
  const poBox = sysConfig?.school_metadata?.po_box || 'P.O. Box 3443 NAKURU';

  useEffect(() => {
    const unsub = storage.subscribe(() => {
      setDeviceActivation(storage.getDeviceActivation());
    });
    return () => unsub();
  }, []);

  const handleRoleSelection = (role: 'teacher' | 'admin') => {
    if (typeof onSelectPortal === 'function') {
      onSelectPortal(role);
    }
    if (typeof onSelectRole === 'function') {
      onSelectRole(role);
    }
  };

  const handleTeacherClick = () => {
    if (storage.isTeacherAuthenticated() && storage.getAuthenticatedTeacherId()) {
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

  const isBound = !!deviceActivation && deviceActivation.status === 'ACTIVE';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 transition-colors">
      <div className="max-w-md w-full mx-auto my-auto flex flex-col items-center text-center">
        {/* School Logo */}
        <div className="relative mb-4">
          <SchoolLogo size="xl" badgeOnly />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-heading">
          LITTLE ROSES <span className="text-rose-600 dark:text-rose-500">ACADEMY</span>
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

        {/* Portals Selection Card Container - 2 ROLES: TEACHER & ADMIN */}
        <div className="w-full space-y-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Portal Access
          </p>

          {/* 1. TEACHER PORTAL BUTTON (Navy Blue) */}
          <button
            id="portal-select-teacher-btn"
            onClick={handleTeacherClick}
            className="w-full group relative overflow-hidden flex items-center justify-between p-4 sm:p-5 bg-[#172554] hover:bg-[#1e3a8a] text-white rounded-2xl shadow-lg shadow-blue-950/20 border-2 border-blue-800/80 transition-all transform active:scale-[0.98] text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/60 border border-blue-400/40 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform shrink-0">
                {isBound ? <Fingerprint className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-wide font-heading">TEACHER</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/20">
                    STAFF PORTAL
                  </span>
                </div>
                <p className="text-xs text-blue-200/90 mt-0.5">
                  {isBound 
                    ? `Paired Device: ${deviceActivation?.teacherName}` 
                    : 'Curriculum Resources, Schemes & Assessment Records'}
                </p>
                <p className="text-[10px] text-blue-300/80 mt-1 font-medium">
                  {isBound ? 'Tap to authenticate (Biometric / Password)' : 'Faculty: Mr. Elvis • Madam Fresiah • Mr. Kelvin • Madam Liz'}
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>

          {/* 2. ADMINISTRATION PORTAL BUTTON (Emerald Green) */}
          <button
            id="portal-select-admin-btn"
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
                  Central Resources, Staff Security & School Records
                </p>
                <p className="text-[10px] text-emerald-200/80 mt-1 font-medium">
                  Password Protected Executive Access
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Official Address & Verification Stamp */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {sysConfig?.school_metadata?.school_name || 'Little Roses Academy'}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {poBox} • Ministry of Education CBC Registered
          </p>
        </div>
      </div>

      {/* Teacher Authentication & Device Activation Modal */}
      {isTeacherAuthOpen && (
        <TeacherAuthModal
          isOpen={isTeacherAuthOpen}
          onClose={() => setIsTeacherAuthOpen(false)}
          onSuccess={handleTeacherAuthSuccess}
        />
      )}

      {/* Admin Authentication Modal */}
      {isAdminAuthOpen && (
        <AdminAuthModal
          isOpen={isAdminAuthOpen}
          onClose={() => setIsAdminAuthOpen(false)}
          onSuccess={handleAdminAuthSuccess}
        />
      )}
    </div>
  );
};
