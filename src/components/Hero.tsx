import React from 'react';
import { ChevronDown, Utensils, Wifi, Clock, MapPin, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface HeroProps {
  onScrollToMenu: () => void;
  onOpenInfo: () => void;
  tableNumber: string;
  onSetTableNumber: (table: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToMenu,
  onOpenInfo,
  tableNumber,
  onSetTableNumber,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#0d0d0f]">
      {/* Background Image with Cinematic Overlay & Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85"
          alt="Ambiente de Punto Bocado Bar"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.42] contrast-[1.08]"
          loading="eager"
        />
        {/* Soft radial and linear dark gradients for crystal-clear readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0f]/80 via-transparent to-[#0d0d0f]/80" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-12 sm:pt-16 sm:pb-16 flex flex-col items-center text-center">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Carta Digital Exclusiva</span>
          </div>

          <button
            onClick={onOpenInfo}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 text-xs font-medium backdrop-blur-md transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{RESTAURANT_INFO.hours}</span>
          </button>
        </div>

        {/* Restaurant Name */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3 sm:mb-4">
          {RESTAURANT_INFO.name}
        </h1>

        {/* Short Tagline */}
        <p className="text-base sm:text-xl text-zinc-300 font-light max-w-xl mb-6 sm:mb-8 leading-relaxed">
          {RESTAURANT_INFO.tagline}
        </p>

        {/* Table selector / Badge in Hero */}
        <div className="mb-7 flex items-center gap-2 bg-white/[0.06] border border-white/10 px-3.5 py-1.5 rounded-2xl backdrop-blur-md">
          <span className="text-xs text-zinc-400 font-medium">¿Estás en el bar?</span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-amber-400">Mesa:</span>
            <input
              type="text"
              placeholder="Ej: 4"
              value={tableNumber}
              onChange={(e) => onSetTableNumber(e.target.value)}
              className="w-12 bg-black/40 border border-white/15 rounded-lg px-2 py-0.5 text-xs font-bold text-white text-center focus:outline-none focus:border-amber-400 transition-colors"
              maxLength={4}
              aria-label="Número de mesa"
            />
          </div>
        </div>

        {/* Primary CTA Button: "Ver Menú" */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            id="hero-ver-menu-btn"
            onClick={onScrollToMenu}
            className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-black font-bold text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Utensils className="w-5 h-5 text-black group-hover:rotate-12 transition-transform duration-200" />
            <span>Ver Menú</span>
            <ChevronDown className="w-4 h-4 text-black group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={onOpenInfo}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Ubicación & WiFi</span>
          </button>
        </div>

        {/* Quick Highlights Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-8 sm:mt-10 pt-6 border-t border-white/10 w-full max-w-lg text-center">
          <div className="flex flex-col items-center">
            <span className="text-amber-400 font-extrabold text-lg sm:text-xl">100%</span>
            <span className="text-[11px] sm:text-xs text-zinc-400">Casero & Fresco</span>
          </div>
          <div className="flex flex-col items-center border-x border-white/10 px-2">
            <span className="text-amber-400 font-extrabold text-lg sm:text-xl">11</span>
            <span className="text-[11px] sm:text-xs text-zinc-400">Categorías</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-amber-400 font-extrabold text-lg sm:text-xl">QR</span>
            <span className="text-[11px] sm:text-xs text-zinc-400">Pedido WhatsApp</span>
          </div>
        </div>
      </div>
    </section>
  );
};
