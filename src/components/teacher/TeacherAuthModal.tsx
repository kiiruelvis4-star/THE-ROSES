import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  X, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { TeacherProfile } from '../../types';
import { storage } from '../../services/storageService';
import { SchoolLogo } from '../SchoolLogo';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (selectedTeacher: TeacherProfile) => void;
  preselectedTeacherId?: string;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preselectedTeacherId
}) => {
  const teacherProfiles = storage.getTeacherProfiles();
  const currentActiveId = preselectedTeacherId || storage.getAuthenticatedTeacherId() || teacherProfiles[0].id;
  
  const [selectedId, setSelectedId] = useState<string>(currentActiveId);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedTeacher = teacherProfiles.find(t => t.id === selectedId) || teacherProfiles[0];

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    if (!password.trim()) {
      setError('Please enter the staff master password.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      if (storage.verifyTeacherPassword(password, selectedTeacher.id)) {
        storage.setAuthenticatedTeacherId(selectedTeacher.id);
        storage.setTeacherAuthenticated(true);
        setIsVerifying(false);
        setPassword('');
        setError(null);
        onSuccess(selectedTeacher);
      } else {
        setIsVerifying(false);
        setError(`Invalid credentials for ${selectedTeacher.name}. Please enter their assigned faculty password.`);
      }
    }, 200);
  };

  return (
    <div 
      id="teacher-auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in"
    >
      <div 
        id="teacher-auth-card"
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all my-6"
      >
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white">
          <button
            id="close-teacher-auth-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Cancel & Return"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 shadow-inner">
              <SchoolLogo size="xs" badgeOnly />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  Staff Authentication
                </span>
                <span className="text-[10px] text-slate-300 font-mono">P.O. Box 3443 Nakuru</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
                Little Roses Teacher Verification
              </h2>
              <p className="text-xs text-blue-200/90 font-medium">
                Select your teacher profile & verify with the master access key.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Step 1: Select Teacher Profile */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center justify-between">
              <span>1. Choose Teacher Profile</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                4 Active Faculty Profiles
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {teacherProfiles.map((profile) => {
                const isSelected = profile.id === selectedId;
                return (
                  <button
                    key={profile.id}
                    id={`select-teacher-${profile.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedId(profile.id);
                      setError(null);
                    }}
                    className={`relative text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs ${profile.avatarColor} shadow-xs`}>
                          {profile.name.replace('MR ', '').replace('MADAM ', '').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                            {profile.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            {profile.tscNumber}
                          </div>
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 mt-0.5" />
                      )}
                    </div>

                    {/* Assigned subjects summary */}
                    <div className="space-y-1 mt-1">
                      {profile.assignments.map((asg, idx) => (
                        <div 
                          key={idx} 
                          className="text-[11px] font-medium text-slate-600 dark:text-slate-300 flex items-center justify-between"
                        >
                          <span className="truncate pr-1">{asg.subject}</span>
                          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700 shrink-0">
                            {asg.gradeSummary}
                          </span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Master Password Form */}
          <form onSubmit={handleVerify} className="space-y-4 pt-1">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="teacher-master-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>2. Password for {selectedTeacher.name}</span>
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Confidential Access
                </span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="teacher-master-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder={`Enter password for ${selectedTeacher.name}`}
                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm font-mono tracking-wide focus:outline-hidden focus:ring-2 transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                    error
                      ? 'border-rose-300 dark:border-rose-800 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-blue-500/20'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  id="toggle-teacher-pwd-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 px-0.5">
                <span>Authorized Little Roses Academy staff access only</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Staff Portal
                </span>
              </div>

              {/* Confidential Security Notice */}
              <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p>
                  Please enter your personal faculty password issued by Little Roses Academy administration to access your educator dashboard and teaching records.
                </p>
              </div>
            </div>

            {error && (
              <div 
                id="teacher-auth-error-banner"
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 animate-shake"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold">Authentication failed: </span>
                  {error}
                </div>
              </div>
            )}

            {/* Selected Profile Confirmation Summary */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg ${selectedTeacher.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                  {selectedTeacher.name.replace('MR ', '').replace('MADAM ', '').slice(0, 1)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Signing in as: {selectedTeacher.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {selectedTeacher.role}
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                id="cancel-teacher-auth-btn"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-teacher-auth-btn"
                disabled={isVerifying || !password.trim()}
                className={`flex-2 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md text-white ${
                  isVerifying || !password.trim()
                    ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 active:scale-98'
                }`}
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Enter as {selectedTeacher.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
