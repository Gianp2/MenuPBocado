import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  TrendingUp,
  Tag,
  Sparkles,
  Utensils,
  DollarSign,
  Check,
  AlertCircle,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { MenuItem, Category } from '../../types';
import { formatPrice } from '../../utils/format';
import { AdminItemModal } from './AdminItemModal';
import { AdminBulkPriceModal } from './AdminBulkPriceModal';

interface AdminItemsTabProps {
  items: MenuItem[];
  categories: Category[];
  onAddItem: (item: Omit<MenuItem, 'id'>) => void;
  onUpdateItem: (id: string, updated: Partial<MenuItem>) => void;
  onDeleteItem: (id: string) => void;
  onDuplicateItem: (id: string) => void;
  onBulkUpdatePrices: (percentage: number, categoryId?: string) => void;
}

export const AdminItemsTab: React.FC<AdminItemsTabProps> = ({
  items,
  categories,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onDuplicateItem,
  onBulkUpdatePrices,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Quick inline price editor state
  const [inlinePriceId, setInlinePriceId] = useState<string | null>(null);
  const [inlinePriceValue, setInlinePriceValue] = useState<number>(0);

  // Filter items
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }
      if (q) {
        const nameMatch = item.name.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        const ingMatch = item.ingredients?.some((ing) => ing.toLowerCase().includes(q));
        return nameMatch || descMatch || ingMatch;
      }
      return true;
    });
  }, [items, selectedCategory, searchQuery]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setItemModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setItemModalOpen(true);
  };

  const handleSaveInlinePrice = (id: string) => {
    if (inlinePriceValue >= 0) {
      onUpdateItem(id, { price: inlinePriceValue });
    }
    setInlinePriceId(null);
  };

  const handleQuickStepPrice = (item: MenuItem, delta: number) => {
    const newPrice = Math.max(0, item.price + delta);
    onUpdateItem(item.id, { price: newPrice });
  };

  return (
    <div className="space-y-3.5 sm:space-y-5">
      {/* Top Toolbar (Optimized for one-handed mobile touch) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#ded8c9] shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8a8479] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar plato, ingrediente..."
            className="w-full pl-9 sm:pl-10 pr-9 py-2.5 sm:py-2 rounded-xl bg-[#fcfbf7] border border-[#ded8c9] text-xs sm:text-sm text-[#272624] placeholder-[#a09a8e] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[32px] min-h-[32px] flex items-center justify-center text-xs font-bold text-[#8a8479] hover:text-[#272624]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Big Action Buttons */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2">
          <button
            onClick={() => setBulkModalOpen(true)}
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#5b7b68]/10 hover:bg-[#5b7b68]/20 active:scale-95 text-[#5b7b68] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            title="Ajustar todos los precios por porcentaje"
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>Ajustar Precios</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#c65526] hover:bg-[#b0481d] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Nuevo Plato</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar with generous touch targets */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1.5 pt-0.5">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-95 ${
            selectedCategory === 'all'
              ? 'bg-[#272624] text-white shadow-xs'
              : 'bg-white text-[#706b61] border border-[#ded8c9] hover:bg-[#ede8db]'
          }`}
        >
          Todos ({items.length})
        </button>
        {categories.map((cat) => {
          const count = items.filter((i) => i.categoryId === cat.id).length;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-95 ${
                isSelected
                  ? 'bg-[#c65526] text-white shadow-xs'
                  : 'bg-white text-[#706b61] border border-[#ded8c9] hover:bg-[#ede8db]'
              }`}
            >
              {cat.shortName || cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Items Responsive Grid: 1 col on mobile, 2 cols on desktop */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#ded8c9] p-6">
          <Utensils className="w-10 h-10 text-[#a09a8e] mx-auto mb-2" />
          <p className="font-bold text-[#272624] text-base">No se encontraron platos</p>
          <p className="text-xs text-[#706b61] mt-1">
            Probá con otra búsqueda o cambiá el filtro de categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {filteredItems.map((item) => {
            const category = categories.find((c) => c.id === item.categoryId);
            const isDeleting = deleteConfirmId === item.id;
            const isEditingPrice = inlinePriceId === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                className="bg-white rounded-2xl border border-[#ded8c9] p-3.5 sm:p-5 flex flex-col justify-between hover:shadow-xs transition-shadow relative overflow-hidden"
              >
                <div>
                  {/* Top Category & Diet/Rinde Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#5b7b68]/10 text-[#5b7b68]">
                      {category?.name || item.categoryId}
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.servesCount && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 border border-amber-500/20">
                          Rinde: {item.servesCount}
                        </span>
                      )}
                      {item.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#f0ebd9] text-[#706b61]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-base sm:text-lg text-[#272624] leading-snug mb-1">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="text-xs sm:text-sm text-[#706b61] line-clamp-2 mb-2.5 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Ingredients Pills */}
                  {item.ingredients && item.ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {item.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-[#f7f5ed] text-[#635f56] px-2 py-0.5 rounded-md border border-[#e8e2d4]"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Variants preview if available */}
                  {item.variants && item.variants.length > 0 && (
                    <div className="text-[11px] text-[#5b7b68] font-medium mb-3 bg-[#5b7b68]/5 px-2.5 py-1.5 rounded-xl border border-[#5b7b68]/15">
                      {item.variants.length} variantes ({item.variants.map((v) => `${v.name}: ${formatPrice(v.price)}`).join(' • ')})
                    </div>
                  )}
                </div>

                {/* Bottom Interactive Area: Price & Large Tactile Action Buttons */}
                <div className="pt-3 border-t border-[#f0ebe0] flex flex-col gap-2.5 mt-auto">
                  {/* Price Row with Quick Step Adjusters */}
                  <div className="flex items-center justify-between gap-2 bg-[#fcfbf7] p-2 rounded-xl border border-[#ede8db]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#8a8479] uppercase">Precio:</span>
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={inlinePriceValue}
                            onChange={(e) => setInlinePriceValue(Number(e.target.value))}
                            step={50}
                            className="w-24 px-2 py-1 text-sm font-extrabold rounded-lg border border-[#c65526] bg-white focus:outline-none"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveInlinePrice(item.id);
                              if (e.key === 'Escape') setInlinePriceId(null);
                            }}
                          />
                          <button
                            onClick={() => handleSaveInlinePrice(item.id)}
                            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-[#c65526] text-white hover:bg-[#b0481d]"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setInlinePriceId(item.id);
                            setInlinePriceValue(item.price);
                          }}
                          className="group flex items-center gap-1 text-left px-2 py-1 rounded-lg hover:bg-[#efe9dc] transition-colors cursor-pointer"
                          title="Tocar para editar precio manual"
                        >
                          <span className="font-extrabold text-base sm:text-lg text-[#c65526]">
                            {formatPrice(item.price)}
                          </span>
                          <Edit2 className="w-3.5 h-3.5 text-[#a09a8e] opacity-70 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </div>

                    {/* Quick Step +/- buttons for easy price adjustment from mobile */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuickStepPrice(item, -500)}
                        className="min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] rounded-lg bg-white border border-[#ded8c9] hover:bg-[#ede8db] active:bg-[#ded8c9] text-xs font-bold text-[#706b61] flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                        title="Restar $500"
                      >
                        -$500
                      </button>
                      <button
                        onClick={() => handleQuickStepPrice(item, 500)}
                        className="min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] rounded-lg bg-white border border-[#ded8c9] hover:bg-[#ede8db] active:bg-[#ded8c9] text-xs font-bold text-[#272624] flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                        title="Sumar $500"
                      >
                        +$500
                      </button>
                    </div>
                  </div>

                  {/* Actions Row: High-touch buttons for mobile */}
                  {isDeleting ? (
                    <div className="flex items-center justify-between gap-2 bg-red-50 p-2.5 rounded-xl border border-red-200">
                      <span className="text-xs font-bold text-red-800">¿Eliminar {item.name}?</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onDeleteItem(item.id);
                            setDeleteConfirmId(null);
                          }}
                          className="min-h-[38px] px-3.5 rounded-lg bg-red-600 active:scale-95 text-white text-xs font-bold hover:bg-red-700 cursor-pointer shadow-2xs"
                        >
                          Sí, Borrar
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="min-h-[38px] px-3.5 rounded-lg bg-gray-200 text-gray-800 text-xs font-bold hover:bg-gray-300 cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {/* Main Edit Button */}
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="col-span-1 min-h-[44px] px-3 rounded-xl bg-[#5b7b68]/15 hover:bg-[#5b7b68]/25 active:scale-95 text-[#5b7b68] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        title="Editar plato completo"
                      >
                        <Edit2 className="w-4 h-4 shrink-0" />
                        <span>Editar</span>
                      </button>

                      {/* Duplicate Button */}
                      <button
                        onClick={() => onDuplicateItem(item.id)}
                        className="min-h-[44px] px-3 rounded-xl bg-white border border-[#ded8c9] hover:bg-[#ede8db] active:scale-95 text-[#706b61] hover:text-[#272624] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                        title="Duplicar plato"
                      >
                        <Copy className="w-4 h-4 shrink-0" />
                        <span>Duplicar</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="min-h-[44px] px-3 rounded-xl bg-white border border-[#ded8c9] hover:bg-red-50 active:scale-95 text-[#a09a8e] hover:text-red-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                        title="Eliminar plato"
                      >
                        <Trash2 className="w-4 h-4 shrink-0" />
                        <span>Borrar</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Item Modal (Create/Edit) */}
      <AdminItemModal
        isOpen={itemModalOpen}
        item={editingItem}
        categories={categories}
        defaultCategoryId={selectedCategory !== 'all' ? selectedCategory : undefined}
        onClose={() => setItemModalOpen(false)}
        onSave={(data) => {
          if (editingItem) {
            onUpdateItem(editingItem.id, data);
          } else {
            onAddItem(data);
          }
        }}
      />

      {/* Bulk Price Updater Modal */}
      <AdminBulkPriceModal
        isOpen={bulkModalOpen}
        categories={categories}
        onClose={() => setBulkModalOpen(false)}
        onApply={(percentage, categoryId) => {
          onBulkUpdatePrices(percentage, categoryId);
        }}
      />
    </div>
  );
};
