import React, { useState, useEffect } from 'react';
import { 
  MoreVertical, 
  ArrowLeft, 
  Bell, 
  Sun, 
  Moon, 
  ShieldCheck, 
  UserCheck,
  LogOut
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import { Menu3DotsModal } from './common/Menu3DotsModal';
import { storage } from '../services/storageService';

interface TopAppBarProps {
  title?: string;
  subtitle?: string;
  currentRole?: 'teacher' | 'admin' | null;
  activeRole?: 'teacher' | 'admin' | null;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onGoHome?: () => void;
  onBack?: () => void;
  showBack?: boolean;
  unreadNoticesCount?: number;
  onOpenNotices?: () => void;
  onSignOut?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  subtitle,
  currentRole,
  activeRole,
  isDarkMode = false,
  onToggleDarkMode,
  onGoHome,
  onBack,
  showBack = false,
  unreadNoticesCount = 0,
  onOpenNotices,
  onSignOut
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-GB', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const effectiveRole = activeRole !== undefined ? activeRole : currentRole;
  const effectiveTitle = title || 'LITTLE ROSES ACADEMY';
  const activeTeacherName = storage.getActiveTeacherProfile()?.name || 'Faculty';

  const computedSubtitle = subtitle || (
    effectiveRole === 'teacher' 
      ? `Nakuru • ${activeTeacherName}` 
      : effectiveRole === 'admin' 
      ? 'Nakuru • Administration Hub' 
      : 'Nakuru • CBC Platform'
  );

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
              onClick={onGoHome}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
              title="Return to Portal Screen"
            >
              <SchoolLogo size="xs" badgeOnly />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight font-heading">
                    {effectiveTitle}
                  </h1>
                  {effectiveRole && (
                    <span
                      className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider ${
                        effectiveRole === 'teacher'
                          ? 'bg-[#172554] text-white'
                          : 'bg-emerald-600 text-white'
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

          {/* Right: Clock, Notices, Theme Toggle & Menu */}
          <div className="flex items-center gap-2">
            {/* Live Clock */}
            <div 
              id="device-live-clock-pill"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs select-none"
              title="Synchronized Device Local Time"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold tracking-wider">{timeString || '00:00:00'}</span>
            </div>

            {onOpenNotices && (
              <button
                onClick={onOpenNotices}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="School Notices"
              >
                <Bell className="w-5 h-5" />
                {unreadNoticesCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                    {unreadNoticesCount}
                  </span>
                )}
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:ring-2 focus:ring-blue-500 active:scale-95"
              title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Exit / Sign Out Button */}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Sign Out / Lock"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* 3-Dot Action Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Menu & Settings"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 3-Dot Menu Modal */}
      <Menu3DotsModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        onSignOut={onSignOut}
        currentRole={effectiveRole}
      />
    </>
  );
};
