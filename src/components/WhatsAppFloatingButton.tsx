import React from 'react';
import { MessageCircle } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface WhatsAppFloatingButtonProps {
  hasItemsInCart: boolean;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  hasItemsInCart,
}) => {
  const handleClick = () => {
    const defaultMsg = encodeURIComponent(
      `¡Hola ${RESTAURANT_INFO.name}! Quería hacer una consulta sobre la carta / realizar una reserva.`
    );
    window.open(`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${defaultMsg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`fixed right-4 sm:right-6 z-30 transition-all duration-300 ${
        hasItemsInCart ? 'bottom-22 sm:bottom-24' : 'bottom-5 sm:bottom-6'
      }`}
    >
      <button
        id="whatsapp-floating-btn"
        onClick={handleClick}
        className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        title="Consultar por WhatsApp"
        aria-label="Consultar por WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-300 rounded-full animate-ping opacity-75" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0d0d0f] rounded-full" />
        <MessageCircle className="w-7 h-7 fill-white text-emerald-500" />
      </button>
    </div>
  );
};
