import React, { useState, useEffect } from 'react';
import { 
  MoreVertical, 
  ArrowLeft, 
  Bell, 
  Calendar as CalendarIcon, 
  User, 
  Sparkles,
  BookOpen,
  GraduationCap,
  Sun,
  Moon,
  ShieldCheck,
  Clock,
  Download
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import { Menu3DotsModal } from './common/Menu3DotsModal';
import { DownloadAppModal } from './common/DownloadAppModal';
import { storage } from '../services/storageService';

interface TopAppBarProps {
  title?: string;
  subtitle?: string;
  currentRole?: 'teacher' | 'learner' | 'admin' | null;
  activeRole?: 'teacher' | 'learner' | 'admin' | null;
  studentName?: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onSwitchPortal?: (role: 'teacher' | 'learner' | 'admin') => void;
  onSwitchRole?: (role?: 'teacher' | 'learner' | 'admin') => void;
  onGoHome?: () => void;
  onBack?: () => void;
  showBack?: boolean;
  unreadNoticesCount?: number;
  onOpenNotices?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  subtitle,
  currentRole,
  activeRole,
  studentName,
  isDarkMode = false,
  onToggleDarkMode,
  onSwitchPortal,
  onSwitchRole,
  onGoHome,
  onBack,
  showBack = false,
  unreadNoticesCount = 2,
  onOpenNotices
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [timeString, setTimeString] = useState<string>('');
  const [systemSchoolName, setSystemSchoolName] = useState(() => {
    return storage.getSystemConfig().school_metadata.school_name || 'Little Roses Academy';
  });

  // Real-time device clock syncing with clockSettings: HH:MM:SS, displaySeconds: true, device_local_time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setSystemSchoolName(storage.getSystemConfig().school_metadata.school_name);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const effectiveTitle = title || systemSchoolName;

  // Normalize role from activeRole or currentRole
  const effectiveRole = activeRole !== undefined ? activeRole : currentRole;

  const handleLogoClick = () => {
    if (typeof onGoHome === 'function') {
      onGoHome();
    } else if (typeof onSwitchPortal === 'function' && effectiveRole) {
      onSwitchPortal(effectiveRole === 'teacher' ? 'learner' : 'teacher');
    } else if (typeof onSwitchRole === 'function' && effectiveRole) {
      onSwitchRole(effectiveRole === 'teacher' ? 'learner' : 'teacher');
    }
  };

  const handleRoleSwitch = (targetRole: 'teacher' | 'learner' | 'admin') => {
    if (typeof onSwitchPortal === 'function') {
      onSwitchPortal(targetRole);
    }
    if (typeof onSwitchRole === 'function') {
      onSwitchRole(targetRole);
    }
  };

  const activeTeacherName = storage.getActiveTeacherProfile()?.name || 'Faculty';

  const computedSubtitle = subtitle || (studentName ? `Learner: ${studentName}` : (effectiveRole === 'teacher' ? `Nakuru • ${activeTeacherName}` : effectiveRole === 'learner' ? 'Nakuru • Learner Portal' : effectiveRole === 'admin' ? 'Nakuru • Administration Hub' : 'Nakuru • CBC EduHub'));

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Left: Back button or Logo + Title */}
          <div className="flex items-center gap-3">
            {showBack && onBack ? (
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : null}

            <div 
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
              title="Return to Main Portal"
            >
              <SchoolLogo size="xs" badgeOnly />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {effectiveTitle}
                  </h1>
                  {effectiveRole && (
                    <span
                      className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider shadow-xs ${
                        effectiveRole === 'teacher'
                          ? 'bg-[#172554] text-white dark:bg-blue-800'
                          : effectiveRole === 'learner'
                          ? 'bg-rose-600 text-white dark:bg-rose-700'
                          : 'bg-emerald-600 text-white dark:bg-emerald-700'
                      }`}
                    >
                      {effectiveRole}
                    </span>
                  )}
                </div>
                {computedSubtitle && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {computedSubtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Clock, Notifications, Theme Toggle & 3-Dot Menu */}
          <div className="flex items-center gap-2">
            {/* Synchronized Device Local Time Clock & v2.0.0 Badge */}
            <div 
              id="device-live-clock-pill"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs shadow-2xs select-none"
              title="Synchronized Device Local Time (HH:MM:SS) • Little Roses EduHub v2.0.0"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold tracking-wider">{timeString || '00:00:00'}</span>
              <span className="text-[10px] font-sans font-semibold text-slate-400 dark:text-slate-500 border-l border-slate-300 dark:border-slate-600 pl-1.5">
                v2.0.0
              </span>
            </div>

            {onOpenNotices && (
              <button
                onClick={onOpenNotices}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="School Notices & Announcements"
              >
                <Bell className="w-5 h-5" />
                {unreadNoticesCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                    {unreadNoticesCount}
                  </span>
                )}
              </button>
            )}

            {/* Direct App Download Button */}
            <button
              onClick={() => setIsDownloadOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
              title="Download Little Roses EduHub Directly (APK / PWA)"
              aria-label="Download App Directly"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download App</span>
            </button>

            {/* Theme Toggle Button (Dark to Light at the top where the 3 dots are) */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:ring-2 focus:ring-blue-500 active:scale-95"
              title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label="Toggle Theme (Dark / Light)"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* 3-Dot Action Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-blue-500"
              title="Menu & Settings"
              aria-label="Open School Contacts and Settings"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Direct App Download Modal */}
      <DownloadAppModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />

      {/* 3-Dot Menu Modal */}
      <Menu3DotsModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        onSwitchPortal={handleRoleSwitch}
        onSwitchRole={handleRoleSwitch}
        currentRole={effectiveRole || 'teacher'}
      />
    </>
  );
};
