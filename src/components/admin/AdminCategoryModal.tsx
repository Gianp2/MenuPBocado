import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Category } from '../../types';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';

interface AdminCategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (categoryData: Omit<Category, 'id'>) => void;
}

export const AdminCategoryModal: React.FC<AdminCategoryModalProps> = ({
  isOpen,
  category,
  onClose,
  onSave,
}) => {
  const isEditing = !!category;

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [icon, setIcon] = useState('UtensilsCrossed');

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setName(category.name || '');
        setShortName(category.shortName || '');
        setSubtitle(category.subtitle || '');
        setIcon(category.icon || 'UtensilsCrossed');
      } else {
        setName('');
        setShortName('');
        setSubtitle('');
        setIcon('UtensilsCrossed');
      }
    }
  }, [isOpen, category]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      shortName: shortName.trim() || name.trim(),
      subtitle: subtitle.trim(),
      icon: icon.trim() || 'UtensilsCrossed',
      accentColor: category?.accentColor || 'from-amber-600/30 to-orange-600/30',
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-2.5 sm:p-4">
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
          className="relative w-full max-w-lg bg-[#fbfaf6] rounded-2xl sm:rounded-3xl border border-[#ded8c9] shadow-2xl p-4 sm:p-6 overflow-hidden z-10"
        >
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#e8e2d4]">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#c65526] block">
                {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#272624] truncate">
                {name || (isEditing ? 'Categoría' : 'Crear Sección')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full text-[#8a8479] hover:text-[#272624] hover:bg-[#ede8db] transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="py-3 sm:py-4 space-y-3.5 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#272624] mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!shortName) setShortName(e.target.value);
                  }}
                  placeholder="Ej: Cafetería & Dulces"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#d6cfbe] text-sm text-[#272624] placeholder-[#a09a8e] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#272624] mb-1">
                  Nombre Corto (Botón barra)
                </label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="Ej: Café & Dulces"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#d6cfbe] text-sm text-[#272624] placeholder-[#a09a8e] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#272624] mb-1">
                Subtítulo / Frase descriptiva
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ej: Granos seleccionados, tostados especiales y pastelería artesanal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#d6cfbe] text-sm text-[#272624] placeholder-[#a09a8e] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e8e2d4]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-[#706b61] hover:bg-[#ede8db] text-center cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#c65526] hover:bg-[#b0481d] active:scale-95 text-white text-xs font-bold shadow-xs cursor-pointer text-center transition-all"
              >
                {isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
