import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';

interface OfflineToastProps {
  onOfflineReady?: boolean;
}

export const OfflineToast: React.FC<OfflineToastProps> = () => {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  const [showToast, setShowToast] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Check initial online status
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
      setShowToast(true);
      setWasOffline(true);
    }

    const handleOffline = () => {
      setIsOffline(true);
      setShowToast(true);
      setWasOffline(true);
    };

    const handleOnline = () => {
      setIsOffline(false);
      // Show "Conexión restablecida" briefly if we were previously offline
      if (wasOffline) {
        setShowToast(true);
        const timer = setTimeout(() => {
          setShowToast(false);
        }, 3500);
        return () => clearTimeout(timer);
      }
    };

    // Custom event dispatched from service worker onOfflineReady
    const handleSwOfflineReady = () => {
      // If service worker is ready for offline caching
      console.log('SW offline ready detected');
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    window.addEventListener('sw:offline-ready', handleSwOfflineReady);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('sw:offline-ready', handleSwOfflineReady);
    };
  }, [wasOffline]);

  if (!showToast) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm transition-all duration-300 animate-fade-in">
      <div
        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-medium backdrop-blur-md transition-colors ${
          isOffline
            ? 'bg-[#272624]/95 text-[#fcfbf7] border-[#d99b62]/40 shadow-black/25'
            : 'bg-[#5b7b68]/95 text-white border-white/20 shadow-[#5b7b68]/25'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {isOffline ? (
            <div className="p-1.5 rounded-full bg-[#d99b62]/20 text-[#d99b62] shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1.5 rounded-full bg-white/20 text-white shrink-0">
              <Wifi className="w-4 h-4" />
            </div>
          )}

          <div className="min-w-0">
            <p className="font-bold font-['Montserrat'] tracking-wide uppercase text-[11px] sm:text-xs">
              {isOffline ? 'Modo Offline Activo' : 'Conexión Restablecida'}
            </p>
            <p className={`text-[11px] leading-tight ${isOffline ? 'text-[#ded8c9]' : 'text-white/90'}`}>
              {isOffline
                ? 'Estás navegando la carta guardada sin conexión.'
                : 'Se recuperó el acceso a internet.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowToast(false)}
          className={`p-1 rounded-full shrink-0 transition-colors cursor-pointer ${
            isOffline
              ? 'hover:bg-white/10 text-[#ded8c9] hover:text-white'
              : 'hover:bg-white/20 text-white'
          }`}
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
