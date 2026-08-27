import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check, WifiOff } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback message for iOS or browsers without direct prompt
      alert('Para instalar la carta en tu pantalla de inicio:\n\n• En Safari / iOS: Tocá el botón "Compartir" y seleccioná "Agregar a pantalla de inicio".\n• En Chrome / Android: Tocá el menú (⋮) y seleccioná "Instalar aplicación".');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Error al solicitar instalación PWA:', err);
    }
  };

  // If offline, show subtle offline mode chip
  if (isOffline) {
    return (
      <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-amber-950/90 text-amber-200 border border-amber-500/40 text-xs font-semibold backdrop-blur-md shadow-2xl flex items-center gap-2 animate-fade-in">
        <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Modo sin conexión activo — Podés seguir viendo la carta</span>
      </div>
    );
  }

  // Show banner only if prompt is available and not dismissed/installed
  if (!deferredPrompt || isDismissed || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-24 sm:bottom-20 left-4 right-4 max-w-md mx-auto z-40 animate-slide-up">
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#18181f]/95 backdrop-blur-md border border-amber-500/30 shadow-2xl text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xs sm:text-sm text-white block">
              Instalar Carta Digital
            </span>
            <span className="text-[11px] text-zinc-400 block">
              Guardala en tu inicio para carga instantánea
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs transition-transform active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
