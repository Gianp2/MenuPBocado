import React from 'react';
import { RESTAURANT_INFO } from '../data/menuData';
import { RestaurantBadge } from './RestaurantBadge';
import { BotanicalDecoration } from './BotanicalDecoration';
import { Wifi, QrCode, MapPin, Clock, Search } from 'lucide-react';

interface HeaderProps {
  onOpenInfo: () => void;
  onOpenQR: () => void;
  onFocusSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInfo, onOpenQR, onFocusSearch }) => {
  return (
    <header className="relative pt-6 pb-6 px-4 text-center overflow-hidden border-b border-[#e5e0d4] bg-[#fbfaf6]">
      {/* Botanical Corner Vector Decorations matching the reference screenshot */}
      <BotanicalDecoration position="top-left" />
      <BotanicalDecoration position="top-right" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Crest Badge */}
        <div className="mb-2">
          <RestaurantBadge size="md" />
        </div>

        {/* Spacer preserving the exact header layout */}
        <div className="h-4 sm:h-5 mb-4" />

        {/* Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <button
            onClick={onOpenInfo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#d6cfbe] text-[#3d3a35] hover:bg-[#f3efe6] transition-colors shadow-2xs font-semibold cursor-pointer"
          >
            <Wifi className="w-3.5 h-3.5 text-[#5b7b68]" />
            <span>WiFi & Info</span>
          </button>

          <button
            onClick={onOpenQR}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#d6cfbe] text-[#3d3a35] hover:bg-[#f3efe6] transition-colors shadow-2xs font-semibold cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-[#b26649]" />
            <span>Código QR</span>
          </button>

          <button
            onClick={onFocusSearch}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#d6cfbe] text-[#3d3a35] hover:bg-[#f3efe6] transition-colors shadow-2xs font-semibold cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#5b7b68]" />
            <span>Buscar plato</span>
          </button>
        </div>
      </div>
    </header>
  );
};
