import React from 'react';
import { motion } from 'motion/react';
import { Plus, Users, Sparkles, Heart, Flame, Check } from 'lucide-react';
import { MenuItem, DietTag } from '../types';
import { formatPrice } from '../utils/format';

interface MenuItemCardProps {
  item: MenuItem;
  onSelectItem: (item: MenuItem) => void;
  isCustomizable?: boolean;
  index?: number;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onSelectItem,
  isCustomizable = true,
  index = 0,
}) => {
  const renderTagBadge = (tag: DietTag) => {
    switch (tag) {
      case 'destacado':
        return (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Destacado
          </span>
        );
      case 'compartir':
        return (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-semibold">
            <Users className="w-3 h-3 text-orange-400" />
            {item.servesCount || 'Compartir'}
          </span>
        );
      case 'veggie':
        return (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
            <Heart className="w-3 h-3 text-emerald-400" />
            Veggie
          </span>
        );
      case 'especial':
        return (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-semibold">
            <Flame className="w-3 h-3 text-red-400" />
            Especial Casa
          </span>
        );
      case 'recomendado':
        return (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px] font-semibold">
            <Check className="w-3 h-3 text-yellow-400" />
            Recomendado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      onClick={() => onSelectItem(item)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#141418] border border-white/10 hover:border-amber-500/40 p-3 sm:p-4 card-hover-effect cursor-pointer overflow-hidden transition-all duration-200"
      id={`menu-item-${item.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectItem(item);
        }
      }}
    >
      {/* Badges Bar */}
      {((item.tags && item.tags.length > 0) || item.servesCount) && (
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          {item.tags && item.tags.map(renderTagBadge)}
          {item.servesCount && !item.tags?.includes('compartir') && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-semibold">
              <Users className="w-3 h-3 text-amber-400" />
              <span>{item.servesCount}</span>
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
            {item.name}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-3">
            {item.description}
          </p>

          {/* Ingredients list pills if present */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.ingredients.slice(0, 3).map((ing, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5"
                >
                  {ing}
                </span>
              ))}
              {item.ingredients.length > 3 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500">
                  +{item.ingredients.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
              {item.variants ? 'Desde' : 'Precio'}
            </span>
            <span className="text-base sm:text-lg font-extrabold text-amber-400 tracking-tight">
              {formatPrice(item.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectItem(item);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 hover:border-transparent font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer"
            aria-label={`Ver detalles y pedir ${item.name}`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Pedir</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
