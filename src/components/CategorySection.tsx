import React from 'react';
import { Category, MenuItem } from '../types';
import { CategoryIcon } from './icons';
import { MenuItemCard } from './MenuItemCard';
import { Sparkles, Utensils, Wine, Pizza, Flame } from 'lucide-react';

interface CategorySectionProps {
  category: Category;
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  items,
  onSelectItem,
}) => {
  if (items.length === 0) return null;

  return (
    <section
      id={`category-${category.id}`}
      className="scroll-mt-32 pt-8 pb-10 border-b border-white/5 last:border-b-0"
    >
      {/* Category Header Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-6 bg-gradient-to-r from-[#18181d] to-[#121215] border border-white/10 p-5 sm:p-7 shadow-lg">
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <CategoryIcon name={category.icon} className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {category.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 text-xs font-semibold">
                  {items.length} {items.length === 1 ? 'opción' : 'opciones'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl font-light leading-relaxed">
                {category.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Special Category Helper Info */}
        {category.id === 'pastas' && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-amber-300/90 font-medium">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Todas las pastas incluyen <strong>salsa casera a elección</strong> (Bolognesa, Mixta, Pesto, Champiñón, Roquefort o Crema).
            </span>
          </div>
        )}

        {category.id === 'platos' && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-amber-300/90 font-medium">
            <Utensils className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Todos los platos y milanesas incluyen <strong>guarnición a elección</strong> (Papas fritas, Caritas, Noisette, Puré, Ensalada o Tortilla).
            </span>
          </div>
        )}

        {category.id === 'picadas' && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-amber-300/90 font-medium">
            <Wine className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Picadas abundantes preparadas al momento con fiambres de primera, cazuelas calientes y empanadas.
            </span>
          </div>
        )}
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {items.map((item, index) => (
          <MenuItemCard
            key={item.id}
            item={item}
            index={index}
            onSelectItem={onSelectItem}
          />
        ))}
      </div>
    </section>
  );
};
