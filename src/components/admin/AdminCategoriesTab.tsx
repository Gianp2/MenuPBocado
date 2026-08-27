import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Layers, Utensils } from 'lucide-react';
import { Category, MenuItem } from '../../types';
import { AdminCategoryModal } from './AdminCategoryModal';

interface AdminCategoriesTabProps {
  categories: Category[];
  items: MenuItem[];
  onAddCategory: (cat: Omit<Category, 'id'>) => void;
  onUpdateCategory: (id: string, updated: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
  onReorderCategories: (fromIndex: number, toIndex: number) => void;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  items,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onReorderCategories,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setModalOpen(true);
  };

  return (
    <div className="space-y-3.5 sm:space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#ded8c9] shadow-xs">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-[#272624]">
            Categorías del Menú ({categories.length})
          </h3>
          <p className="text-xs text-[#706b61]">
            Organiza las secciones y el orden en el que aparecen en la carta.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#c65526] hover:bg-[#b0481d] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Categories Grid (1 col on mobile, 2 cols on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
        {categories.map((cat, index) => {
          const itemCount = items.filter((i) => i.categoryId === cat.id).length;
          const isDeleting = deleteConfirmId === cat.id;

          return (
            <motion.div
              key={cat.id}
              layout
              className="bg-white rounded-2xl border border-[#ded8c9] p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-xs transition-shadow"
            >
              <div className="flex items-start gap-3 w-full mb-3">
                {/* Order Index & Icon */}
                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                  <span className="w-6 text-center text-xs font-extrabold text-[#8a8479] bg-[#f5f2e9] py-1 rounded-md">
                    #{index + 1}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#f0ebd9] border border-[#ded8c9] flex items-center justify-center text-[#b26649] shrink-0">
                    <Utensils className="w-5 h-5" />
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm sm:text-base text-[#272624] truncate">
                      {cat.name}
                    </h4>
                    <span className="text-[10px] font-bold text-[#c65526] bg-[#c65526]/10 px-2 py-0.5 rounded-md shrink-0">
                      {itemCount} platos
                    </span>
                  </div>
                  {cat.subtitle && (
                    <p className="text-xs text-[#706b61] line-clamp-1 mt-0.5">
                      {cat.subtitle}
                    </p>
                  )}
                  <span className="text-[11px] text-[#8a8479] mt-0.5 block truncate">
                    Nombre en barra: <strong className="text-[#555149]">{cat.shortName}</strong>
                  </span>
                </div>
              </div>

              {/* Action and Reorder Buttons (Minimum 44px touch targets) */}
              <div className="pt-2.5 border-t border-[#f0ebe0] flex items-center justify-between gap-2">
                {/* Move buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onReorderCategories(index, index - 1)}
                    disabled={index === 0}
                    className="min-h-[40px] min-w-[40px] rounded-xl bg-[#f7f5ed] border border-[#ded8c9] text-[#706b61] hover:bg-[#ede8db] active:bg-[#ded8c9] disabled:opacity-25 flex items-center justify-center cursor-pointer transition-colors"
                    title="Mover arriba en la carta"
                    aria-label="Mover arriba"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onReorderCategories(index, index + 1)}
                    disabled={index === categories.length - 1}
                    className="min-h-[40px] min-w-[40px] rounded-xl bg-[#f7f5ed] border border-[#ded8c9] text-[#706b61] hover:bg-[#ede8db] active:bg-[#ded8c9] disabled:opacity-25 flex items-center justify-center cursor-pointer transition-colors"
                    title="Mover abajo en la carta"
                    aria-label="Mover abajo"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Edit & Delete Action Buttons */}
                {isDeleting ? (
                  <div className="flex items-center gap-1.5 bg-red-50 p-1.5 rounded-xl border border-red-200">
                    <span className="text-[11px] font-bold text-red-800 px-1">¿Borrar?</span>
                    <button
                      onClick={() => {
                        onDeleteCategory(cat.id);
                        setDeleteConfirmId(null);
                      }}
                      className="min-h-[36px] px-3 rounded-lg bg-red-600 active:scale-95 text-white text-xs font-bold hover:bg-red-700 cursor-pointer shadow-2xs"
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="min-h-[36px] px-3 rounded-lg bg-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-300 cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="min-h-[40px] px-3.5 rounded-xl bg-[#5b7b68]/15 hover:bg-[#5b7b68]/25 active:scale-95 text-[#5b7b68] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Editar categoría"
                    >
                      <Edit2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(cat.id)}
                      className="min-h-[40px] min-w-[40px] rounded-xl bg-white border border-[#ded8c9] hover:bg-red-50 active:scale-95 text-[#a09a8e] hover:text-red-600 flex items-center justify-center cursor-pointer"
                      title="Eliminar categoría"
                    >
                      <Trash2 className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Category Modal */}
      <AdminCategoryModal
        isOpen={modalOpen}
        category={editingCategory}
        onClose={() => setModalOpen(false)}
        onSave={(data) => {
          if (editingCategory) {
            onUpdateCategory(editingCategory.id, data);
          } else {
            onAddCategory(data);
          }
        }}
      />
    </div>
  );
};
