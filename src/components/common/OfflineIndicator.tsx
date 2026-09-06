import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showReconnectedToast, setShowReconnectedToast] = useState(false);

  useEffect(() => {
    if (isOnline) {
      setShowReconnectedToast(true);
      const t = setTimeout(() => setShowReconnectedToast(false), 3000);
      return () => clearTimeout(t);
    }
  }, [isOnline]);

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-xl shadow-amber-950/30 border border-amber-400/40 animate-pulse">
        <WifiOff className="w-4 h-4 shrink-0" />
        <span>Offline Mode — All changes saved locally on device</span>
      </div>
    );
  }

  if (showReconnectedToast) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/30 border border-emerald-400/40 animate-fade-in transition-all">
        <Wifi className="w-3.5 h-3.5" />
        <span>Connected to Little Roses Cloud</span>
      </div>
    );
  }

  return null;
};
