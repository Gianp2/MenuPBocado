import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Check, Sparkles, Tag, DollarSign, Layers } from 'lucide-react';
import { MenuItem, Category, DietTag } from '../../types';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';

interface AdminItemModalProps {
  isOpen: boolean;
  item: MenuItem | null; // null for creating a new item
  categories: Category[];
  defaultCategoryId?: string;
  onClose: () => void;
  onSave: (itemData: Omit<MenuItem, 'id'>) => void;
}

const AVAILABLE_TAGS: { id: DietTag; label: string; color: string }[] = [
  { id: 'destacado', label: '⭐ Destacado', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'especial', label: '👑 Especial de la Casa', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'recomendado', label: '👍 Recomendado', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'veggie', label: '🌱 Vegetariano', color: 'bg-green-100 text-green-800 border-green-300' },
  { id: 'compartir', label: '👥 Para Compartir', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'nuevo', label: '✨ Nuevo', color: 'bg-rose-100 text-rose-800 border-rose-300' },
];

export const AdminItemModal: React.FC<AdminItemModalProps> = ({
  isOpen,
  item,
  categories,
  defaultCategoryId,
  onClose,
  onSave,
}) => {
  const isEditing = !!item;

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(defaultCategoryId || categories[0]?.id || 'pastas');
  const [price, setPrice] = useState<number | ''>(10000);
  const [description, setDescription] = useState('');
  const [servesCount, setServesCount] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [tags, setTags] = useState<DietTag[]>([]);

  // Variants state (optional sizes / portions with individual prices)
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<{ name: string; price: number; description?: string }[]>([]);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setName(item.name || '');
        setCategoryId(item.categoryId || categories[0]?.id || 'pastas');
        setPrice(item.price || 0);
        setDescription(item.description || '');
        setServesCount(item.servesCount || '');
        setIngredients(item.ingredients || []);
        setTags(item.tags || []);
        if (item.variants && item.variants.length > 0) {
          setHasVariants(true);
          setVariants(item.variants);
        } else {
          setHasVariants(false);
          setVariants([]);
        }
      } else {
        setName('');
        setCategoryId(defaultCategoryId || categories[0]?.id || 'pastas');
        setPrice(9500);
        setDescription('');
        setServesCount('');
        setIngredients([]);
        setTags([]);
        setHasVariants(false);
        setVariants([]);
      }
      setNewIngredient('');
    }
  }, [isOpen, item, defaultCategoryId, categories]);

  if (!isOpen) return null;

  const handleAddIngredient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newIngredient.trim();
    if (clean && !ingredients.includes(clean)) {
      setIngredients([...ingredients, clean]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, idx) => idx !== indexToRemove));
  };

  const handleToggleTag = (tag: DietTag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { name: 'Porción individual', price: Number(price) || 0 }]);
  };

  const handleUpdateVariant = (index: number, field: string, val: string | number) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: val } : v))
    );
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      categoryId,
      price: Number(price) || 0,
      description: description.trim(),
      servesCount: servesCount.trim() || undefined,
      ingredients: ingredients.length > 0 ? ingredients : undefined,
      tags: tags.length > 0 ? tags : undefined,
      variants: hasVariants && variants.length > 0 ? variants : undefined,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#fbfaf6] rounded-2xl sm:rounded-3xl border border-[#ded8c9] shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#e8e2d4] bg-white">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#c65526] block">
                {isEditing ? 'Editar Plato' : 'Nuevo Plato'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#272624] truncate">
                {name || (isEditing ? 'Plato' : 'Crear Plato / Bebida')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full text-[#8a8479] hover:text-[#272624] hover:bg-[#ede8db] transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body (Scrollable) */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Grid 1: Name and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#272624] mb-1">
                  Nombre del Plato *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Sorrentinos de Jamón y Queso"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#d6cfbe] text-sm text-[#272624] placeholder-[#a09a8e] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#272624] mb-1">
                  Categoría *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#d6cfbe] text-sm text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid 2: Price and Serves count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#272624] mb-1">
                  Precio Base ($ ARS) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8a8479] font-bold text-sm">
                    $
                  </div>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    min={0}
                    step={50}
                    required
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white border border-[#d6cfbe] text-sm font-bold text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#272624] mb-1">
                  Porción / Rinde (Opcional)
                </label>
                <input
                  type="text"
                  value={servesCount}
                  onChange={(e) => setServesCount(e.target.value)}
                  placeholder="Ej: Para 2 personas, Rinde 6 porciones"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#d6cfbe] text-sm text-[#272624] placeholder-[#a09a8e] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#272624] mb-1">
                Descripción del Plato
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Detalles sobre elaboración, cocción, tipo de salsa o acompañamientos..."
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#d6cfbe] text-sm text-[#272624] placeholder-[#a09a8e] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
              />
            </div>

            {/* Ingredients Manager */}
            <div>
              <label className="block text-xs font-bold text-[#272624] mb-1">
                Ingredientes Principales
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddIngredient();
                    }
                  }}
                  placeholder="Escribí un ingrediente (ej: Queso roquefort, Rúcula) y pulsá Enter"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#d6cfbe] text-xs text-[#272624] placeholder-[#a09a8e] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-3.5 py-2 rounded-xl bg-[#5b7b68] hover:bg-[#4d6958] text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar</span>
                </button>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-white/70 rounded-xl border border-[#ded8c9]">
                {ingredients.length === 0 ? (
                  <span className="text-xs text-[#a09a8e] italic">
                    Sin ingredientes cargados aún.
                  </span>
                ) : (
                  ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f0ebd9] text-[#272624] text-xs font-medium border border-[#ded8c9]"
                    >
                      <span>{ing}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="text-[#8c867b] hover:text-red-600 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Diet Tags Selection */}
            <div>
              <label className="block text-xs font-bold text-[#272624] mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#c65526]" />
                <span>Etiquetas Destacadas</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((t) => {
                  const isSelected = tags.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleToggleTag(t.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? `${t.color} ring-2 ring-offset-1 ring-[#c65526]`
                          : 'bg-white text-[#706b61] border-[#ded8c9] hover:bg-[#f6f2e8]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Variants toggle (Pintas, Tamaños, Porciones) */}
            <div className="pt-2 border-t border-[#e8e2d4]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-bold text-[#272624] block">
                    Variantes de Tamaño / Porción
                  </span>
                  <span className="text-[11px] text-[#706b61]">
                    ¿Tiene diferentes tamaños (ej: Chica / Grande, Pinta / Media)?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!hasVariants) {
                      setHasVariants(true);
                      if (variants.length === 0) {
                        setVariants([
                          { name: 'Individual / Chica', price: Number(price) || 0 },
                          { name: 'Para Compartir / Grande', price: Math.round((Number(price) || 0) * 1.6) },
                        ]);
                      }
                    } else {
                      setHasVariants(false);
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    hasVariants ? 'bg-[#c65526]' : 'bg-[#ded8c9]'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      hasVariants ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {hasVariants && (
                <div className="space-y-2.5 bg-white p-3.5 rounded-2xl border border-[#ded8c9]">
                  {variants.map((v, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleUpdateVariant(i, 'name', e.target.value)}
                        placeholder="Nombre variante (ej: Media Pinta)"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#fcfbf7] border border-[#d6cfbe] text-xs text-[#272624]"
                      />
                      <div className="relative w-28">
                        <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs text-[#8a8479]">
                          $
                        </span>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => handleUpdateVariant(i, 'price', Number(e.target.value))}
                          step={50}
                          className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-[#fcfbf7] border border-[#d6cfbe] text-xs font-bold text-[#272624]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(i)}
                        className="p-1.5 text-[#a09a8e] hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="w-full py-2 rounded-lg border border-dashed border-[#5b7b68] text-[#5b7b68] hover:bg-[#5b7b68]/5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar otra variante</span>
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 px-4 sm:px-6 py-3 sm:py-4 border-t border-[#e8e2d4] bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-[#706b61] hover:bg-[#ede8db] transition-colors cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#c65526] hover:bg-[#b0481d] text-white text-xs font-bold tracking-wide shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer text-center"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Plato'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
