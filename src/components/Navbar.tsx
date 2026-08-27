import React from 'react';
import { Search, ShoppingBag, QrCode, Info, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface NavbarProps {
  cartItemCount: number;
  onOpenCart: () => void;
  onOpenInfo: () => void;
  onOpenQR: () => void;
  onFocusSearch: () => void;
  tableNumber: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItemCount,
  onOpenCart,
  onOpenInfo,
  onOpenQR,
  onFocusSearch,
  tableNumber,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-white/10 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
            <span className="font-extrabold text-black text-lg tracking-tighter">PB</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                {RESTAURANT_INFO.name}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Abierto" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-zinc-400">
              {tableNumber ? `Mesa #${tableNumber} • Bar & Cocina` : 'Carta Digital Oficial'}
            </span>
          </div>
        </a>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search */}
          <button
            id="nav-search-btn"
            onClick={onFocusSearch}
            className="p-2 sm:px-3 sm:py-2 rounded-xl glass-pill text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all flex items-center gap-2"
            title="Buscar en la carta"
            aria-label="Buscar en el menú"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline text-xs font-medium text-zinc-300">Buscar plato</span>
          </button>

          {/* Info & WiFi */}
          <button
            id="nav-info-btn"
            onClick={onOpenInfo}
            className="p-2 rounded-xl glass-pill text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            title="Horarios, Ubicación y WiFi"
            aria-label="Información del bar"
          >
            <Info className="w-4 h-4 text-zinc-300" />
          </button>

          {/* QR Share */}
          <button
            id="nav-qr-btn"
            onClick={onOpenQR}
            className="p-2 rounded-xl glass-pill text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all hidden xs:flex items-center justify-center"
            title="Compartir Carta QR"
            aria-label="Compartir código QR"
          >
            <QrCode className="w-4 h-4 text-zinc-300" />
          </button>

          {/* Cart / WhatsApp Order Drawer Trigger */}
          <button
            id="nav-cart-btn"
            onClick={onOpenCart}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 active:scale-95 ${
              cartItemCount > 0
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold shadow-lg shadow-amber-500/25'
                : 'glass-pill text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
            aria-label="Ver mi pedido"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">
              {cartItemCount > 0 ? 'Mi Pedido' : 'Pedido'}
            </span>
            {cartItemCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-black text-amber-400 font-bold text-xs">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
