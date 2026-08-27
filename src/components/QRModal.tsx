import React, { useState } from 'react';
import { X, QrCode, Share2, Check } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose }) => {
  useLockBodyScroll(isOpen);

  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://puntobocadobar.com';

  if (!isOpen) return null;

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Carta Digital | ${RESTAURANT_INFO.name}`,
          text: `Mirá el menú completo de ${RESTAURANT_INFO.name}:`,
          url: currentUrl,
        });
      } catch {
        // Ignored if user cancels share dialog
      }
    } else {
      // Fallback if Web Share API is not supported on desktop
      navigator.clipboard.writeText(currentUrl);
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2500);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=fbfaf6&color=272624&margin=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overscroll-contain animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-xs bg-[#fcfbf7] border border-[#dcd6c7] rounded-2xl p-5 shadow-xl text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-[#66625a] hover:bg-[#ede8db] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-full bg-[#b26649]/10 text-[#b26649] flex items-center justify-center mx-auto mb-2">
          <QrCode className="w-5 h-5" />
        </div>

        <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#272624] font-['Montserrat'] mb-1">
          Carta Digital QR
        </h3>
        <p className="text-[11px] text-[#66625a] mb-4">
          Escaneá con el celular para compartir la carta con tu mesa.
        </p>

        {/* QR Image */}
        <div className="p-3 bg-white border border-[#ded8c9] rounded-xl inline-block shadow-2xs mb-4">
          <img
            src={qrImageUrl}
            alt="Código QR Carta Punto Bocado"
            className="w-40 h-40 mx-auto"
          />
        </div>

        {/* Action Button - Only Share */}
        <div>
          <button
            onClick={handleShareNative}
            className="w-full py-2.5 px-4 rounded-xl bg-[#b26649] hover:bg-[#9c563c] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            {copiedFeedback ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>¡Enlace Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Compartir Carta</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
