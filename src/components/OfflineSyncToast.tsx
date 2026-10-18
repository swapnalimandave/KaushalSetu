import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Check } from 'lucide-react';

export const OfflineSyncToast: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowToast(true);
      setSyncStatus('syncing');

      setTimeout(() => {
        setSyncStatus('synced');
        setTimeout(() => {
          setShowToast(false);
          setSyncStatus('idle');
        }, 2500);
      }, 1500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowToast(true);
      setSyncStatus('idle');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showToast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-16 sm:bottom-6 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-in slide-in-from-bottom duration-200"
    >
      <div
        className={`
          p-3.5 rounded-xl border-2 shadow-[3px_3px_0px_#0A1931] flex items-center justify-between gap-3 text-[13px] font-bold
          ${
            !isOnline
              ? 'bg-[#FAF9F4] border-[#0A1931] text-[#0A1931]'
              : syncStatus === 'syncing'
              ? 'bg-[#DCECF3] border-[#0A1931] text-[#0A1931]'
              : 'bg-[#58B98C] border-[#0A1931] text-white'
          }
        `}
      >
        <div className="flex items-center gap-2.5">
          {!isOnline ? (
            <WifiOff className="w-4.5 h-4.5 text-[#EF6F61] shrink-0" />
          ) : syncStatus === 'syncing' ? (
            <Wifi className="w-4.5 h-4.5 text-[#4A7FA7] shrink-0 animate-pulse" />
          ) : (
            <Check className="w-4.5 h-4.5 stroke-[3] shrink-0" />
          )}

          <span>
            {!isOnline
              ? "You're offline. Downloaded lessons are still available."
              : syncStatus === 'syncing'
              ? 'Back online. Syncing your progress…'
              : 'Progress synced.'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowToast(false)}
          className="text-xs underline hover:opacity-75 cursor-pointer ml-2 shrink-0"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
