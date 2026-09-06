import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Share2, 
  PlusSquare, 
  MoreVertical, 
  CheckCircle2, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  WifiOff, 
  ExternalLink 
} from 'lucide-react';
import { SchoolLogo } from '../SchoolLogo';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallGuideModal: React.FC<PWAInstallGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const { isInstallable, install, isIOS, isAndroid } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(
    isIOS ? 'ios' : isAndroid ? 'android' : 'android'
  );
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#2563eb] text-white p-5 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/90 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <SchoolLogo size="sm" badgeOnly className="drop-shadow-md" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" /> PWA Mobile App
              </div>
              <h2 className="text-xl font-black tracking-tight leading-snug">
                Install Little Roses EduHub
              </h2>
              <p className="text-xs text-blue-100/90 font-medium">
                Nakuru • Much from Little
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Quick 1-Click Install Button if supported by browser */}
          {isInstallable && !installSuccess && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-2 border-blue-300 dark:border-blue-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
                  <Download className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    One-Tap Quick Install
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Your browser supports direct installation
                  </p>
                </div>
              </div>
              <button
                onClick={handleNativeInstall}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Install Now
              </button>
            </div>
          )}

          {installSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">App Installed Successfully!</p>
                <p className="text-xs">You can now open Little Roses from your home screen.</p>
              </div>
            </div>
          )}

          {/* Device Tabs */}
          <div>
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 text-xs font-bold text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'android'
                    ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-white shadow-xs font-extrabold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Android Phone
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'ios'
                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs font-extrabold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> iPhone / iPad
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'desktop'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-extrabold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Laptop / PC
              </button>
            </div>

            {/* Android Instructions */}
            {activeTab === 'android' && (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                {/* Direct APK Download Card */}
                <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                        <Download className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-emerald-950 dark:text-emerald-200">
                          Direct Android APK Download
                        </div>
                        <div className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                          LittleRosesEduHub.apk • v1.0.0 (455 KB)
                        </div>
                      </div>
                    </div>
                  </div>
                  <a
                    href="/LittleRosesEduHub.apk"
                    download="LittleRosesEduHub.apk"
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
                  >
                    <Download className="w-4 h-4" /> Download APK to Phone
                  </a>
                  <p className="text-[10px] text-emerald-800/70 dark:text-emerald-300/70 text-center">
                    Tap the downloaded file on your phone and tap <strong>Install</strong>.
                  </p>
                </div>

                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2 pt-1">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  Or Install via Chrome / Samsung Browser:
                </p>

                <div className="space-y-2.5 pt-1 text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      Open this website in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong> on your phone.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="flex items-center gap-1 flex-wrap">
                      Tap the <strong>three dots menu (<MoreVertical className="w-3.5 h-3.5 inline text-slate-900 dark:text-white" />)</strong> in the top-right corner of your browser.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] shrink-0 mt-0.5">
                      4
                    </span>
                    <p>
                      Tap <strong>Install</strong> to confirm. The official <strong>Little Roses EduHub</strong> icon will appear on your phone home screen!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* iPhone / iPad Instructions */}
            {activeTab === 'ios' && (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-rose-600" />
                  How to install on iPhone & iPad (Safari):
                </p>

                <div className="space-y-2.5 pt-1 text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-600 text-white font-black text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      Open this page in <strong>Safari</strong> on your iPhone or iPad.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-600 text-white font-black text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="flex items-center gap-1 flex-wrap">
                      Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline text-blue-600 font-bold" /> at the bottom of your screen (or top on iPad).
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-600 text-white font-black text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <p className="flex items-center gap-1 flex-wrap">
                      Scroll down in the share sheet and tap <strong className="inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 text-slate-800 dark:text-white" /> "Add to Home Screen"</strong>.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-600 text-white font-black text-[10px] shrink-0 mt-0.5">
                      4
                    </span>
                    <p>
                      Tap <strong>"Add"</strong> in the top right corner. The school app icon is now on your iOS home screen!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Instructions */}
            {activeTab === 'desktop' && (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  How to install on Windows / Mac / Chromebook:
                </p>

                <div className="space-y-2.5 pt-1 text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-black text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      In Chrome, Edge, or Brave, look at the right side of the address bar (URL bar).
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-black text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      Click the <strong>Install (<Download className="w-3.5 h-3.5 inline" />)</strong> icon in the address bar or click "Install Little Roses" in browser settings.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Key PWA Features */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-xs">Fast & Lightweight</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Under 2MB, loads instantly</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5">
              <WifiOff className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-xs">Offline CBC Sync</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Save marks without internet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official PWA Application
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
