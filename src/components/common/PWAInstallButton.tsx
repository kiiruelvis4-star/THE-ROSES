import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallGuideModal } from './PWAInstallGuideModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full' | 'pill' | 'header';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'pill'
}) => {
  const { isInstalled, isInstallable, install, isIOS } = usePWAInstall();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // If already installed as a standalone PWA, do not show install button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setIsGuideOpen(true);
      }
    } else {
      setIsGuideOpen(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleClick}
          title="Install app on your phone or computer"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:hover:bg-blue-900/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 transition-all active:scale-95 shadow-xs ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline">Install App</span>
        </button>
      )}

      {variant === 'pill' && (
        <button
          onClick={handleClick}
          className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-600/20 active:scale-95 transition-all ${className}`}
        >
          <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          <span>Install on Phone</span>
        </button>
      )}

      {variant === 'compact' && (
        <button
          onClick={handleClick}
          title="Install on Mobile"
          className={`p-2 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors ${className}`}
        >
          <Smartphone className="w-4 h-4" />
        </button>
      )}

      {variant === 'full' && (
        <button
          onClick={handleClick}
          className={`w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#2563eb] hover:opacity-95 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-950/20 active:scale-[0.98] transition-all border border-blue-400/30 ${className}`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Install Little Roses on Phone</span>
        </button>
      )}

      <PWAInstallGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </>
  );
};
