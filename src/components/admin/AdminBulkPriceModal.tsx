import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, DollarSign, AlertTriangle, Check } from 'lucide-react';
import { Category } from '../../types';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';

interface AdminBulkPriceModalProps {
  isOpen: boolean;
  categories: Category[];
  onClose: () => void;
  onApply: (percentage: number, categoryId?: string) => void;
}

export const AdminBulkPriceModal: React.FC<AdminBulkPriceModalProps> = ({
  isOpen,
  categories,
  onClose,
  onApply,
}) => {
  const [percentage, setPercentage] = useState<number>(10);
  const [targetCategory, setTargetCategory] = useState<string>('all');
  const [isConfirmed, setIsConfirmed] = useState(false);

  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(percentage, targetCategory === 'all' ? undefined : targetCategory);
    setIsConfirmed(true);
    setTimeout(() => {
      setIsConfirmed(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-2.5 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#fbfaf6] rounded-2xl sm:rounded-3xl border border-[#ded8c9] shadow-2xl p-4 sm:p-6 overflow-hidden z-10"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d4]">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-full bg-[#c65526]/10 text-[#c65526] flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#272624] truncate">
                Ajuste Masivo de Precios
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#8a8479] hover:text-[#272624] hover:bg-[#ede8db] shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 sm:py-4 space-y-3.5 sm:space-y-4">
            <p className="text-xs text-[#706b61]">
              Modificá rápidamente los precios de todos los platos o de una categoría específica por un porcentaje (se redondea a múltiplos de $50).
            </p>

            {/* Percentage selector */}
            <div>
              <label className="block text-xs font-bold text-[#272624] mb-2">
                Porcentaje de Ajuste (%)
              </label>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                {[-10, 5, 10, 15, 20].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPercentage(preset)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      percentage === preset
                        ? 'bg-[#c65526] text-white shadow-xs'
                        : 'bg-white border border-[#ded8c9] text-[#706b61] hover:bg-[#f2ece0]'
                    }`}
                  >
                    {preset > 0 ? `+${preset}%` : `${preset}%`}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  step={1}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#d6cfbe] text-sm font-bold text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
                />
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-[#8a8479]">
                  %
                </span>
              </div>
            </div>

            {/* Scope / Category */}
            <div>
              <label className="block text-xs font-bold text-[#272624] mb-1">
                Aplicar a:
              </label>
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#d6cfbe] text-sm text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
              >
                <option value="all">Todas las categorías (Todo el menú)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    Solo: {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Warning Note */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Esta acción recalculará los precios base y variantes del grupo seleccionado.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e8e2d4]">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-[#706b61] hover:bg-[#ede8db] text-center cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              disabled={isConfirmed}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#c65526] hover:bg-[#b0481d] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer text-center"
            >
              {isConfirmed ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Actualizados!</span>
                </>
              ) : (
                <span>Aplicar {percentage > 0 ? `+${percentage}%` : `${percentage}%`}</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
