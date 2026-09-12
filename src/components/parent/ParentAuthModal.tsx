import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  Lock,
  Eye,
  EyeOff,
  WifiOff,
  KeyRound
} from 'lucide-react';
import { Student } from '../../types';
import { storage } from '../../services/storageService';

interface ParentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const ParentAuthModal: React.FC<ParentAuthModalProps> = ({
  isOpen,
  onClose,
  students,
  onSelectStudent
}) => {
  const [admInput, setAdmInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleAdmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanAdm = admInput.trim().toUpperCase();
    const cleanPass = passwordInput.trim();

    if (!cleanAdm) {
      setErrorMessage('Please enter your learner admission number.');
      return;
    }
    if (!cleanPass) {
      setErrorMessage('Please enter your learner password.');
      return;
    }

    const found = students.find(s => 
      s.admissionNumber.toUpperCase().trim() === cleanAdm ||
      s.id.toUpperCase().trim() === cleanAdm ||
      cleanAdm === s.admissionNumber.toUpperCase().trim().replace(/[^A-Z0-9]/g, '')
    );

    if (!found) {
      setErrorMessage(`No record found for Admission Number "${cleanAdm}". Please verify the number on your child's assessment report.`);
      return;
    }

    // Verify real learner password (no default bypasses)
    const isValid = storage.verifyLearnerPassword(found.admissionNumber, cleanPass);
    if (!isValid) {
      setErrorMessage('Invalid learner password. Please enter the authentic password assigned to this learner or contact the school administration.');
      return;
    }

    storage.setActiveLearnerId(found.id);
    onSelectStudent(found);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
                <GraduationCap className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h2 className="text-lg font-black font-heading tracking-tight">
                  Parent & Learner Portal
                </h2>
                <p className="text-xs text-slate-300">
                  Little Roses Academy • Private & Confidential
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Privacy Notice Banner */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 rounded-2xl flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-300 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed font-medium">
              Student data is private and encrypted. Only parents and authorized guardians possessing the authentic learner admission number and password can view records.
            </p>
          </div>

          {/* Sign In By Admission Number & Real Password */}
          <form onSubmit={handleAdmSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Learner Admission Number
              </label>
              <input
                type="text"
                value={admInput}
                onChange={(e) => {
                  setAdmInput(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="e.g. LRA-2021-084"
                autoFocus
                className="w-full px-4 py-3 text-sm font-mono tracking-wider rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden transition-all uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Learner Password</span>
                <span className="text-[10px] text-slate-400 font-normal">Authentic Credentials Required</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Enter real learner password"
                  className="w-full pl-4 pr-11 py-3 text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-semibold leading-relaxed">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-950/20 transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Access Learner Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Offline & App Installation helper */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <WifiOff className="w-3.5 h-3.5" />
              <span>100% Offline Compatible</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Once loaded, all academic assessments, CAT records, and revision materials remain available on this device without active internet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
