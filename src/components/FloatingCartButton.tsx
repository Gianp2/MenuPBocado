import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/format';

interface FloatingCartButtonProps {
  itemCount: number;
  totalAmount: number;
  onOpenCart: () => void;
}

export const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  itemCount,
  totalAmount,
  onOpenCart,
}) => {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-40 animate-slide-up">
      <button
        id="floating-cart-btn"
        onClick={onOpenCart}
        className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-black font-extrabold shadow-2xl shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between sm:justify-start gap-4 border border-amber-300/40 cursor-pointer"
        aria-label={`Ver pedido actual (${itemCount} ítems, total ${formatPrice(totalAmount)})`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-black text-amber-400 flex items-center justify-center font-bold text-xs">
            {itemCount}
          </div>
          <span className="text-sm font-bold text-black tracking-tight">Ver Pedido</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-black">
            {formatPrice(totalAmount)}
          </span>
          <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
        </div>
      </button>
    </div>
  );
};
