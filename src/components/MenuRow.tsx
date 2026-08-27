import React from 'react';
import { motion } from 'motion/react';
import { MenuItem } from '../types';
import { formatPrice } from '../utils/format';

interface MenuRowProps {
  item: MenuItem;
  index?: number;
  onSelectItem?: (item: MenuItem) => void;
}

export const MenuRow: React.FC<MenuRowProps> = ({ item, index = 0, onSelectItem }) => {
  const hasVariants = item.variants && item.variants.length > 0;

  return (
    <motion.div
      onClick={() => onSelectItem && onSelectItem(item)}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.04, 0.25),
        ease: 'easeOut',
      }}
      className={`py-2.5 sm:py-3 border-b border-[#2c2b29]/5 last:border-b-0 group transition-colors ${
        onSelectItem ? 'cursor-pointer hover:bg-[#b26649]/5 rounded-lg px-2 -mx-2' : ''
      }`}
      role={onSelectItem ? 'button' : undefined}
      tabIndex={onSelectItem ? 0 : undefined}
      onKeyDown={(e) => {
        if (onSelectItem && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelectItem(item);
        }
      }}
    >
      {/* If item has variants (e.g. Simple / Completo) */}
      {hasVariants ? (
        <div className="space-y-1.5 w-full">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs sm:text-[13px] md:text-sm font-extrabold uppercase tracking-wide text-[#201e1d] font-['Montserrat']">
              {item.name}:
            </span>
          </div>

          <div className="text-[12px] sm:text-[13px] text-[#4a4742] leading-snug">
            {item.description}
          </div>

          {/* Variants list with robust responsiveness */}
          <div className="mt-1.5 space-y-1.5 pl-1 sm:pl-3">
            {item.variants!.map((variant, vIdx) => (
              <div key={vIdx} className="flex flex-col xs:flex-row xs:items-baseline justify-between gap-1 text-xs sm:text-[13px]">
                <div className="flex items-baseline flex-1 min-w-0 pr-1">
                  <span className="font-semibold text-[#2c2b29] leading-snug">
                    {variant.name}:
                  </span>
                  <span className="hidden sm:inline-block flex-1 menu-dots mx-2 opacity-50 self-center h-2" />
                </div>
                <div className="flex items-baseline justify-end shrink-0 self-end xs:self-auto">
                  <span className="font-extrabold text-[#201e1d] font-['Montserrat'] tracking-tight whitespace-nowrap">
                    {formatPrice(variant.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Standard Single Item Line with Dot Leader */
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 w-full">
          <div className="flex-1 min-w-0 leading-snug pr-1">
            <span className="text-xs sm:text-[13px] md:text-sm font-extrabold uppercase tracking-wide text-[#201e1d] font-['Montserrat'] mr-1.5">
              {item.name}:
            </span>
            <span className="text-[12px] sm:text-[13px] text-[#4a4742]">
              {item.description}
            </span>
            {item.tags?.includes('veggie') && (
              <span className="ml-1.5 text-[10px] text-[#5b7b68] font-bold uppercase tracking-wider">
                (Veggie)
              </span>
            )}
            {item.servesCount && (
              <span className="ml-1.5 text-[10px] text-[#b26649] font-bold uppercase tracking-wider">
                ({item.servesCount})
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-end gap-1 shrink-0 mt-0.5 sm:mt-0">
            <span className="hidden sm:inline-block w-10 md:w-12 menu-dots opacity-50 self-center h-2 mr-1" />
            <span className="font-black text-xs sm:text-[13px] md:text-sm text-[#201e1d] font-['Montserrat'] tracking-tight whitespace-nowrap">
              {formatPrice(item.price)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
