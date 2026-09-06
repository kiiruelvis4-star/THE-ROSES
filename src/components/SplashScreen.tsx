import React, { useEffect, useState } from 'react';
import { SchoolLogo } from './SchoolLogo';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete?: () => void;
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, onFinish }) => {
  const [progress, setProgress] = useState(0);

  const handleFinish = () => {
    if (typeof onComplete === 'function') {
      onComplete();
    }
    if (typeof onFinish === 'function') {
      onFinish();
    }
  };

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2200; // 2.2 seconds smooth load

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          handleFinish();
        }, 350);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete, onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#111c3a] via-[#162752] to-[#0d152c] text-white p-6 sm:p-8 select-none overflow-hidden">
      {/* Background Decorative Rings and Glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top spacing */}
      <div className="w-full flex justify-end">
        <button
          onClick={handleFinish}
          className="text-xs text-blue-200/70 hover:text-white flex items-center gap-1 transition-opacity px-3 py-1.5 rounded-full hover:bg-white/10"
        >
          Skip <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center text-center max-w-sm w-full my-auto animate-fadeIn">
        {/* Animated Circular School Crest */}
        <div className="relative mb-6">
          <div className="absolute -inset-3 bg-gradient-to-r from-amber-400 to-rose-500 rounded-full opacity-30 blur-md animate-pulse" />
          <SchoolLogo size="2xl" badgeOnly className="relative" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase drop-shadow-sm font-heading">
          LITTLE ROSES <span className="text-rose-400">ACADEMY</span>
        </h1>

        <p className="text-xs font-bold tracking-[0.25em] text-blue-200 uppercase mt-1">
          CBC • TEACH • ASSESS • EXCEL
        </p>

        {/* Motto */}
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-inner">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          <span className="text-sm italic font-serif text-rose-200 font-medium tracking-wide">
            "Much from Little"
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        </div>
      </div>

      {/* Bottom Horizontal Animated 0-100% Progress Bar */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3 pb-8">
        <div className="w-full flex justify-between text-xs font-semibold text-blue-200/90 tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Loading EduHub...
          </span>
          <span>{progress}%</span>
        </div>

        {/* Horizontal Progress Track */}
        <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-75 shadow-lg shadow-rose-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[11px] text-blue-300/60 font-medium">
          Nakuru, Kenya • Term 1 Academic Session
        </p>
      </div>
    </div>
  );
};
