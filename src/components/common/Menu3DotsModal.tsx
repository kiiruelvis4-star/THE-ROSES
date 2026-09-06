import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Moon, 
  Sun, 
  RefreshCw, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  UserCheck,
  BookOpen,
  Settings,
  MapPin,
  Smartphone,
  GitBranch,
  FolderDown
} from 'lucide-react';
import { SchoolLogo } from '../SchoolLogo';
import { storage } from '../../services/storageService';
import { SchoolConfigModal } from '../modals/SchoolConfigModal';
import { DownloadAppModal } from './DownloadAppModal';

interface Menu3DotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onSwitchPortal?: (role: 'teacher' | 'learner' | 'admin') => void;
  onSwitchRole?: (role: 'teacher' | 'learner' | 'admin') => void;
  currentRole?: 'teacher' | 'learner' | 'admin' | null;
}

export const Menu3DotsModal: React.FC<Menu3DotsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode = false,
  onToggleDarkMode,
  onSwitchPortal,
  onSwitchRole,
  currentRole = 'teacher'
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncTimestamp, setSyncTimestamp] = useState(storage.getLastSyncTime());
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [systemConfig, setSystemConfig] = useState(() => storage.getSystemConfig());

  if (!isOpen) return null;

  const handleToggleTheme = () => {
    if (typeof onToggleDarkMode === 'function') {
      onToggleDarkMode();
    } else {
      document.documentElement.classList.toggle('dark');
    }
  };

  const handleSwitch = (targetRole: 'teacher' | 'learner' | 'admin') => {
    if (typeof onSwitchPortal === 'function') {
      onSwitchPortal(targetRole);
    }
    if (typeof onSwitchRole === 'function') {
      onSwitchRole(targetRole);
    }
    onClose();
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleManualSync = () => {
    setSyncing(true);
    setTimeout(() => {
      storage.triggerManualSync();
      setSyncTimestamp(storage.getLastSyncTime());
      setSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 800);
  };

  const handleExportBackup = () => {
    const jsonStr = storage.exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Little_Roses_EduHub_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && storage.importDataJSON(content)) {
        alert('Database backup successfully restored!');
        onClose();
      } else {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data back to original Little Roses Academy factory demo records?')) {
      storage.resetToFactoryDemo();
      alert('Data reset successfully!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with School Branding */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <SchoolLogo size="sm" />
            <div>
              <h2 className="font-extrabold text-base tracking-tight">LITTLE ROSES ACADEMY</h2>
              <p className="text-xs text-rose-300 font-medium">EduHub Portal Menu & Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-6">
          {/* 1. Official School Contacts */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Official School Contacts
            </h3>

            {/* School Email */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">School Official Email</div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white select-all">
                    roseslittle3@gmail.com
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyToClipboard('roseslittle3@gmail.com', 'email')}
                  className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-xs flex items-center gap-1"
                  title="Copy email address"
                >
                  {copiedKey === 'email' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href="mailto:roseslittle3@gmail.com"
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                  title="Send Email"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Headteacher Contact */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Headteacher Contact</div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {systemConfig.school_metadata.head_teacher_name || 'Mr. Kelvin'} <span className="text-slate-600 dark:text-slate-300 font-medium">({systemConfig.school_metadata.phone || '0798 193966'})</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyToClipboard(systemConfig.school_metadata.phone || '0798193966', 'phone')}
                  className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-xs flex items-center gap-1"
                  title="Copy phone number"
                >
                  {copiedKey === 'phone' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={`tel:${(systemConfig.school_metadata.phone || '0798193966').replace(/\s+/g, '')}`}
                  className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                  title="Call Headteacher"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* School Postal Address */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Postal Address</div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white select-all">
                    {systemConfig.school_metadata.po_box || 'P.O. Box 3443 NAKURU'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyToClipboard(systemConfig.school_metadata.po_box || 'P.O. Box 3443 NAKURU', 'pobox')}
                  className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-xs flex items-center gap-1"
                  title="Copy postal address"
                >
                  {copiedKey === 'pobox' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* 2. App Settings & Theme */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              App Settings & Theme
            </h3>

            {/* System Configuration & School Metadata */}
            <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-600 text-white shadow-xs">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    School System Configuration
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {systemConfig.school_metadata.school_name} • {systemConfig.active_academic_year} {systemConfig.active_term}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Configure
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-indigo-950 text-indigo-400' : 'bg-amber-100 text-amber-600'}`}>
                  {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Switch between eye-friendly themes
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Offline Sync Status & Controls */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Offline Sync & Storage</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Last Sync: {syncTimestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                All teacher schemes, records, timetable, and CAT marks are instantly cached locally for zero-latency offline use.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleManualSync}
                  disabled={syncing}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : syncSuccess ? 'Synced!' : 'Sync Now'}
                </button>

                <button
                  onClick={handleExportBackup}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Backup
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                <label className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium">
                  <Upload className="w-3.5 h-3.5" />
                  Restore JSON
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
                <button
                  onClick={handleResetData}
                  className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Download App & GitHub Repository Hub */}
            <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/60 dark:to-blue-950/20 rounded-xl border border-blue-200/60 dark:border-blue-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-600 text-white rounded-md">
                    <FolderDown className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Download & GitHub Repository</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Export code, download Android APK, or sync to GitHub</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">v2.0.0</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Download Android APK */}
                <a
                  href="/TheRoses.apk"
                  download="TheRoses.apk"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-xs"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>The Roses APK (v2.0.0)</span>
                </a>

                {/* Direct App Install & Options Modal */}
                <button
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Guide & Options</span>
                </button>
              </div>

              {/* Export Data Backup */}
              <button
                onClick={handleExportBackup}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
              >
                <FolderDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Export Offline Database JSON</span>
              </button>

              {/* GitHub Path */}
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Target GitHub Repository:
                  </span>
                  <button
                    onClick={() => copyToClipboard('https://github.com/kiiruelvis4/the-roses.git', 'gh_repo')}
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-[10px] font-bold"
                  >
                    {copiedKey === 'gh_repo' ? (
                      <span className="text-emerald-600 flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Copied!</span>
                    ) : (
                      <span className="flex items-center gap-0.5"><Copy className="w-3 h-3" /> Copy URL</span>
                    )}
                  </button>
                </div>
                <div className="font-mono text-[10px] bg-slate-50 dark:bg-slate-950 p-1.5 rounded text-slate-600 dark:text-slate-400 break-all select-all">
                  https://github.com/kiiruelvis4/the-roses.git
                </div>
                <div className="text-[10px] text-slate-500 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <p>• <strong>To download source ZIP:</strong> Click top-right AI Studio menu → <em>Export to ZIP</em>.</p>
                  <p>• <strong>To push to GitHub:</strong> <code className="text-blue-600 dark:text-blue-400 font-mono">git push -u origin main</code></p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Quick Portal Switcher (3 Dashboards: Teacher, Learner, Administration) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600 text-white rounded-md">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Active Portal</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Currently viewing: <span className="font-bold text-blue-600 dark:text-blue-400 capitalize">{currentRole || 'teacher'} Dashboard</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handleSwitch('teacher')}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  currentRole === 'teacher'
                    ? 'bg-[#172554] text-white shadow-sm ring-2 ring-blue-500'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                }`}
              >
                <span>Teacher</span>
                {currentRole === 'teacher' && <span className="text-[9px] text-blue-200 uppercase font-black">Active</span>}
              </button>

              <button
                onClick={() => handleSwitch('learner')}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  currentRole === 'learner'
                    ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                }`}
              >
                <span>Learner</span>
                {currentRole === 'learner' && <span className="text-[9px] text-rose-200 uppercase font-black">Active</span>}
              </button>

              <button
                onClick={() => handleSwitch('admin')}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  currentRole === 'admin'
                    ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                }`}
              >
                <span>Admin</span>
                {currentRole === 'admin' && <span className="text-[9px] text-emerald-200 uppercase font-black">Active</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 text-center border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          {systemConfig.school_metadata.school_name} • Nakuru, Kenya • CBC Portal v2.6
        </div>
      </div>

      {/* School Configuration Modal */}
      <SchoolConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={systemConfig}
        onConfigUpdated={(newCfg) => {
          setSystemConfig(newCfg);
        }}
      />

      {/* Direct App Download & Options Modal */}
      <DownloadAppModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};
