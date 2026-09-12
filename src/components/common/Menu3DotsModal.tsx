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
  Settings,
  Lock,
  LogOut
} from 'lucide-react';
import { SchoolLogo } from '../SchoolLogo';
import { storage } from '../../services/storageService';
import { SchoolConfigModal } from '../modals/SchoolConfigModal';

interface Menu3DotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onSwitchPortal?: (role: 'teacher' | 'admin') => void;
  onSwitchRole?: (role: 'teacher' | 'admin') => void;
  onSignOut?: () => void;
  currentRole?: 'teacher' | 'admin' | 'learner' | 'parent' | null;
}

export const Menu3DotsModal: React.FC<Menu3DotsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode = false,
  onToggleDarkMode,
  onSignOut,
  currentRole = 'teacher'
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncTimestamp, setSyncTimestamp] = useState(storage.getLastSyncTime());
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [systemConfig, setSystemConfig] = useState(() => storage.getSystemConfig());

  if (!isOpen) return null;

  const handleToggleTheme = () => {
    if (typeof onToggleDarkMode === 'function') {
      onToggleDarkMode();
    } else {
      document.documentElement.classList.toggle('dark');
    }
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
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const success = storage.importDataJSON(json);
        if (success) {
          alert('Data restored successfully! The page will now reload.');
          window.location.reload();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data to school defaults? This cannot be undone.')) {
      storage.resetAllDataToDefaults();
      alert('Data reset to default school records. Reloading...');
      window.location.reload();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with School Branding */}
        <div className="flex items-center justify-between p-5 bg-[#172554] text-white">
          <div className="flex items-center gap-3">
            <SchoolLogo size="sm" />
            <div>
              <h2 className="font-extrabold text-base tracking-tight font-heading">LITTLE ROSES ACADEMY</h2>
              <p className="text-xs text-rose-300 font-medium">EduHub Menu & Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-5">
          {/* 1. Official School Contacts */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Official School Contacts
            </h3>

            {/* School Email */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Official Email</div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white select-all">
                    roseslittle3@gmail.com
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyToClipboard('roseslittle3@gmail.com', 'email')}
                  className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 rounded-lg transition-colors text-xs"
                  title="Copy email"
                >
                  {copiedKey === 'email' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href="mailto:roseslittle3@gmail.com"
                  className="p-1.5 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Headteacher Contact */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Headteacher Contact</div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {systemConfig.school_metadata.head_teacher_name || 'Mr. Kelvin'} ({systemConfig.school_metadata.phone || '0798 193966'})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyToClipboard(systemConfig.school_metadata.phone || '0798193966', 'phone')}
                  className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 rounded-lg text-xs"
                >
                  {copiedKey === 'phone' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={`tel:${(systemConfig.school_metadata.phone || '0798193966').replace(/\s+/g, '')}`}
                  className="p-1.5 text-emerald-600 dark:text-emerald-400 rounded-lg"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* 2. System Controls */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              System Settings
            </h3>

            {/* Dark Mode Toggle */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-950 text-indigo-400' : 'bg-amber-100 text-amber-600'}`}>
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {isDarkMode ? 'Dark Theme' : 'Light Theme'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Switch visual display mode
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

            {/* Offline Sync Status & Backup */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Offline Local Storage</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {syncTimestamp}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleManualSync}
                  disabled={syncing}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Syncing...' : 'Sync Cache'}</span>
                </button>

                <button
                  onClick={handleExportBackup}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Backup JSON</span>
                </button>
              </div>

              {currentRole === 'admin' && (
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
              )}
            </div>
          </div>

          {/* Sign Out / Exit Portal */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                if (typeof onSignOut === 'function') {
                  onSignOut();
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out / Lock Session</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/80 text-center border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          {systemConfig.school_metadata.school_name} • P.O. Box 3443 Nakuru
        </div>
      </div>

      {/* School Configuration Modal */}
      {isConfigModalOpen && (
        <SchoolConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          config={systemConfig}
          onConfigUpdated={(newCfg) => {
            setSystemConfig(newCfg);
          }}
        />
      )}
    </div>
  );
};
