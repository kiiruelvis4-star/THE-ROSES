import React from 'react';
import { AlertCircle, X, ArrowLeft, LogOut } from 'lucide-react';

interface ExitAppModalProps {
  isOpen: boolean;
  onStay: () => void;
  onExit: () => void;
}

export const ExitAppModal: React.FC<ExitAppModalProps> = ({
  isOpen,
  onStay,
  onExit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 animate-in zoom-in-95">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl shadow-inner">
          🥺
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Leaving App
          </h3>
          <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
            Oppsy leaving already 🥺😭
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            All your offline records, schemes, and marks are safely saved locally.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onStay}
            className="w-full py-2.5 px-4 bg-[#0288d1] hover:bg-[#0277bd] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>Stay</span>
          </button>

          <button
            type="button"
            onClick={onExit}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-700 hover:text-rose-700 dark:text-slate-300 dark:hover:text-rose-300 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
