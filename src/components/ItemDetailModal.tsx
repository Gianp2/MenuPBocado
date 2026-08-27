import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, ShoppingBag, MessageCircle, Sparkles, Users } from 'lucide-react';
import { MenuItem, CartItem } from '../types';
import { formatPrice } from '../utils/format';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

interface ItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  useLockBodyScroll(!!item);

  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    item.variants ? item.variants[0] : undefined
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');

  // Reset state when item changes
  useEffect(() => {
    setQuantity(1);
    setSelectedVariant(item.variants ? item.variants[0] : undefined);
    setNotes('');

    // Pre-select first option for required options
    if (item.options) {
      const initialOptions: Record<string, string> = {};
      item.options.forEach((opt) => {
        if (opt.items.length > 0) {
          initialOptions[opt.title] = opt.items[0];
        }
      });
      setSelectedOptions(initialOptions);
    } else {
      setSelectedOptions({});
    }
  }, [item]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const basePrice = selectedVariant ? selectedVariant.price : item.price;
  const totalPrice = basePrice * quantity;

  const handleOptionSelect = (groupTitle: string, optionName: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupTitle]: optionName,
    }));
  };

  const handleAddToCartSubmit = () => {
    const newCartItem: CartItem = {
      cartItemId: `${item.id}-${Date.now()}`,
      item,
      quantity,
      selectedVariant,
      selectedOptions,
      notes: notes.trim(),
      totalPrice,
    };
    onAddToCart(newCartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full sm:max-w-lg bg-[#15151a] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-all active:scale-90"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto no-scrollbar pt-6 pb-6">
          <div className="px-5 sm:px-6 pt-2">
            {/* Title & Price */}
            <div className="flex items-start justify-between gap-3 mb-2 pr-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {item.name}
                </h2>
                {item.servesCount && (
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>Rinde: {item.servesCount}</span>
                  </div>
                )}
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-amber-400 shrink-0">
                {formatPrice(basePrice)}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              {item.description}
            </p>

            {/* Full Ingredients List */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="mb-5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-xs uppercase font-bold text-amber-400/90 tracking-wider block mb-2">
                  Ingredientes & Detalle:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-zinc-300 border border-white/10"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Variants Selector (e.g. Simple vs Completo) */}
            {item.variants && item.variants.length > 0 && (
              <div className="mb-5">
                <label className="text-xs uppercase font-bold text-zinc-400 tracking-wider block mb-2">
                  Elegí la variedad:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {item.variants.map((variant) => {
                    const isSelected = selectedVariant?.name === variant.name;
                    return (
                      <button
                        key={variant.name}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-white'
                            : 'bg-white/[0.02] border-white/10 text-zinc-300 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-amber-400 bg-amber-400'
                                : 'border-zinc-500'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <div>
                            <span className="text-sm font-semibold block">{variant.name}</span>
                            {variant.description && (
                              <span className="text-xs text-zinc-400 block">{variant.description}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-bold text-amber-400 ml-2">
                          {formatPrice(variant.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Options Groups (e.g., Salsas, Guarniciones, Queso) */}
            {item.options &&
              item.options.map((optGroup) => (
                <div key={optGroup.title} className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                      {optGroup.title}:
                    </label>
                    <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded">
                      Obligatorio
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {optGroup.items.map((optName) => {
                      const isSelected = selectedOptions[optGroup.title] === optName;
                      return (
                        <button
                          key={optName}
                          type="button"
                          onClick={() => handleOptionSelect(optGroup.title, optName)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-400 text-white font-semibold shadow-sm'
                              : 'bg-white/[0.02] border-white/10 text-zinc-300 hover:bg-white/[0.05]'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-amber-400 bg-amber-400 text-black'
                                : 'border-zinc-500'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="truncate">{optName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

            {/* Special Instructions Notes */}
            <div className="mb-4">
              <label className="text-xs uppercase font-bold text-zinc-400 tracking-wider block mb-1.5">
                Aclaraciones o preferencias (opcional):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Sin cebolla, carne bien cocida, aderezo aparte..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none h-18"
                maxLength={180}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions: Quantity & Add to Cart */}
        <div className="sticky bottom-0 z-20 bg-[#121216] border-t border-white/10 p-4 sm:p-5 flex items-center justify-between gap-3 shadow-2xl">
          {/* Quantity Controls */}
          <div className="flex items-center bg-black/60 border border-white/10 rounded-2xl p-1 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-white text-base">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            id="modal-add-to-cart-btn"
            onClick={handleAddToCartSubmit}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-black" />
            <span>Agregar • {formatPrice(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
