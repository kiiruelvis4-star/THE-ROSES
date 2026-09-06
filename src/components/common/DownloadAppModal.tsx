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
  ArrowDownCircle,
  FileCode,
  Laptop,
  Check,
  ExternalLink,
  FolderDown,
  FolderArchive,
  Terminal
} from 'lucide-react';
import { SchoolLogo } from '../SchoolLogo';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { storage } from '../../services/storageService';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
  isOpen,
  onClose
}) => {
  const { isInstallable, isInstalled, install, isIOS, isAndroid } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'zip' | 'apk' | 'pwa' | 'ios' | 'desktop'>('zip');
  const [downloadTriggered, setDownloadTriggered] = useState(false);
  const [zipDownloadTriggered, setZipDownloadTriggered] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadAPK = () => {
    setDownloadTriggered(true);
    const a = document.createElement('a');
    a.href = '/TheRoses.apk';
    a.download = 'TheRoses.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloadTriggered(false), 4000);
  };

  const handleDownloadZip = () => {
    setZipDownloadTriggered(true);
    const a = document.createElement('a');
    a.href = '/LittleRosesEduHub-source.zip';
    a.download = 'LittleRosesEduHub-v2.0-source.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setZipDownloadTriggered(false), 4000);
  };

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#2563eb] text-white p-5 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <SchoolLogo size="sm" badgeOnly className="drop-shadow-md" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <Download className="w-3 h-3" /> Direct App Download
              </div>
              <h2 className="text-xl font-black tracking-tight leading-snug">
                Download Little Roses EduHub
              </h2>
              <p className="text-xs text-blue-100/90 font-medium">
                Nakuru • Standalone Offline School App
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Quick Primary Action 1: Project Source Code ZIP Download */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-900/20 border-2 border-amber-300 dark:border-amber-700/60 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-amber-950 dark:text-amber-200">
                      Project Source Code (.ZIP Archive)
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-amber-200 dark:bg-amber-800/80 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded-full">
                      New v2.0 • 2.5 MB
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/80 dark:text-amber-300/80 mt-0.5">
                    Complete standalone codebase: React 18, TypeScript, CBC evaluation engine, offline data, and Android native wrapper.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadZip}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-black text-sm rounded-xl shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2.5"
            >
              {zipDownloadTriggered ? (
                <>
                  <Check className="w-5 h-5 text-slate-950" />
                  <span>Downloading LittleRosesEduHub-v2.0-source.zip...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download App ZIP Archive Directly (2.5 MB)</span>
                </>
              )}
            </button>

            {zipDownloadTriggered && (
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg text-[11px] text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ZIP download initiated! Extract anywhere to run locally or inspect source files.</span>
              </div>
            )}
          </div>

          {/* Quick Primary Action 2: Direct APK Download */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-700/60 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-emerald-950 dark:text-emerald-200">
                      Android APK Direct File
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-emerald-200 dark:bg-emerald-800/80 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded-full">
                      v2.0.0 • 847 KB
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 mt-0.5">
                    Download and install directly on any Android phone or tablet.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadAPK}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2.5"
            >
              {downloadTriggered ? (
                <>
                  <Check className="w-5 h-5 text-emerald-100" />
                  <span>Downloading TheRoses.apk...</span>
                </>
              ) : (
                <>
                  <ArrowDownCircle className="w-5 h-5" />
                  <span>Download The Roses APK (v2.0.0)</span>
                </>
              )}
            </button>

            {downloadTriggered && (
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg text-[11px] text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Download started! Check your phone's notification bar or Downloads folder to install.</span>
              </div>
            )}
          </div>

          {/* Browser Direct PWA Install Banner */}
          {isInstallable && !installSuccess && (
            <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border-2 border-blue-300 dark:border-blue-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    One-Tap Browser Install (PWA)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Direct installation is supported by your current browser
                  </p>
                </div>
              </div>
              <button
                onClick={handleNativeInstall}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Download className="w-4 h-4" /> Install Now
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>EduHub is already installed as a standalone application on this device.</span>
            </div>
          )}

          {/* Detailed Instructions Tabs */}
          <div>
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3 text-xs font-bold text-slate-600 dark:text-slate-300 overflow-x-auto">
              <button
                onClick={() => setActiveTab('zip')}
                className={`flex-1 min-w-[90px] py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'zip'
                    ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-black'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FolderArchive className="w-3.5 h-3.5" /> Source ZIP
              </button>
              <button
                onClick={() => setActiveTab('apk')}
                className={`flex-1 min-w-[90px] py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'apk'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-black'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Android APK
              </button>
              <button
                onClick={() => setActiveTab('pwa')}
                className={`flex-1 min-w-[90px] py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'pwa'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-black'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Chrome / PWA
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 min-w-[90px] py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'ios'
                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs font-black'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" /> Apple iOS
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 min-w-[90px] py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'desktop'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-black'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" /> PC / Laptop
              </button>
            </div>

            {/* Tab 0: ZIP Source Code Instructions */}
            {activeTab === 'zip' && (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  How to Use the Project ZIP Archive:
                </h4>
                <div className="space-y-2 text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] shrink-0 mt-0.5">1</span>
                    <p>Click <strong>"Download App ZIP Archive Directly"</strong> to save the complete project bundle.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] shrink-0 mt-0.5">2</span>
                    <div>
                      <p className="font-semibold">To run locally on your PC / Mac:</p>
                      <div className="p-2 mt-1 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] space-y-0.5">
                        <p className="text-emerald-400"># 1. Extract the zip file</p>
                        <p className="text-slate-300">unzip LittleRosesEduHub-v2.0-source.zip</p>
                        <p className="text-emerald-400 mt-1"># 2. Install dependencies & start server</p>
                        <p className="text-slate-300">npm install</p>
                        <p className="text-slate-300">npm run dev</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] shrink-0 mt-0.5">3</span>
                    <p>You can also export a fresh ZIP at any time from Google AI Studio by clicking the <strong>Settings (⚙️) menu &gt; Export to ZIP</strong>.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 1: APK Instructions */}
            {activeTab === 'apk' && (
              <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  How to Install the APK on Android:
                </h4>
                <div className="space-y-2 text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] shrink-0 mt-0.5">1</span>
                    <p>Tap the green <strong>"Download Android APK Directly"</strong> button above.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] shrink-0 mt-0.5">2</span>
                    <p>If your phone warns <em>"File might be harmful"</em> or <em>"Install unknown apps"</em>, tap <strong>Download anyway</strong> and allow browser installation.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] shrink-0 mt-0.5">3</span>
                    <p>Open the downloaded <strong>TheRoses.apk</strong> file and tap <strong>Install</strong>. Done!</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Chrome / PWA Instructions */}
            {activeTab === 'pwa' && (
              <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Install via Google Chrome or Samsung Internet:
                </h4>
                <div className="space-y-2 text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] shrink-0 mt-0.5">1</span>
                    <p>Tap the <strong>three dots (<MoreVertical className="w-3.5 h-3.5 inline text-slate-900 dark:text-white" />)</strong> in the top right of your browser.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] shrink-0 mt-0.5">2</span>
                    <p>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] shrink-0 mt-0.5">3</span>
                    <p>Tap <strong>Install</strong>. Little Roses EduHub will launch as a full-screen native app with offline caching.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: iPhone / iPad Instructions */}
            {activeTab === 'ios' && (
              <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Add to Home Screen on Apple iOS (Safari):
                </h4>
                <div className="space-y-2 text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-600 text-white font-black text-[10px] shrink-0 mt-0.5">1</span>
                    <p>Open this portal in <strong>Safari</strong> on your iPhone or iPad.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-600 text-white font-black text-[10px] shrink-0 mt-0.5">2</span>
                    <p>Tap the <strong>Share</strong> icon <Share2 className="w-3.5 h-3.5 inline text-blue-600 font-bold" /> at the bottom of the screen.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-600 text-white font-black text-[10px] shrink-0 mt-0.5">3</span>
                    <p>Select <strong className="inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 text-slate-800 dark:text-white" /> "Add to Home Screen"</strong> and tap <strong>Add</strong>.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Desktop Instructions */}
            {activeTab === 'desktop' && (
              <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Install on Windows / Mac / Chromebook:
                </h4>
                <div className="space-y-2 text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-black text-[10px] shrink-0 mt-0.5">1</span>
                    <p>Look at the right side of the browser address bar for the <strong>Install (<Download className="w-3.5 h-3.5 inline" />)</strong> icon.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-black text-[10px] shrink-0 mt-0.5">2</span>
                    <p>Click <strong>Install</strong> to add Little Roses EduHub to your desktop and taskbar as a native window.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Secondary Options: Database Backup & Source Code */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={handleExportBackup}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <FolderDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Export Database JSON</span>
            </button>

            <a
              href="https://github.com/kiiruelvis4/the-roses.git"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Git Repository</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Little Roses Academy • Nakuru
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
