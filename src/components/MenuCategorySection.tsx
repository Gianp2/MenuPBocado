import React from 'react';
import { motion } from 'motion/react';
import { Category, MenuItem } from '../types';
import { MenuRow } from './MenuRow';
import { PASTA_SAUCES, GUARNICIONES } from '../data/menuData';

interface MenuCategorySectionProps {
  category: Category;
  items: MenuItem[];
  onSelectItem?: (item: MenuItem) => void;
  pastaSauces?: string[];
  guarniciones?: string[];
}

export const MenuCategorySection: React.FC<MenuCategorySectionProps> = ({
  category,
  items,
  onSelectItem,
  pastaSauces = PASTA_SAUCES,
  guarniciones = GUARNICIONES,
}) => {
  return (
    <motion.section
      id={`category-${category.id}`}
      className="relative mb-10 sm:mb-14 scroll-mt-28"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Category Title with Terracotta Color and Underline */}
      <div className="mb-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-widest uppercase text-[#b26649] font-['Montserrat'] flex items-center gap-2">
          <span>{category.name}</span>
        </h2>
        {/* Subtle decorative underline */}
        <div className="w-16 h-1 bg-[#b26649]/80 rounded-full mt-1" />

        {/* Section Intro / Subtitle note */}
        {category.subtitle && (
          <p className="text-[12px] sm:text-[13px] text-[#55524c] italic mt-2 leading-relaxed font-serif">
            {category.subtitle}.
          </p>
        )}
      </div>

      {/* Items Sheet / Card */}
      <div className="bg-white/80 rounded-xl p-3.5 sm:p-5 border border-[#e6e2d8] shadow-xs">
        <div className="divide-y divide-[#ece8dc]">
          {items.map((item, index) => (
            <MenuRow
              key={item.id}
              item={item}
              index={index}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>

        {/* Extra Section Notes if Applicable */}
        {category.id === 'pastas' && pastaSauces.length > 0 && (
          <div className="mt-4 pt-3 border-t border-dashed border-[#d4cec0] bg-[#f8f6ee]/80 p-3 rounded-lg text-xs text-[#524e47]">
            <span className="font-bold text-[#b26649] uppercase tracking-wider block mb-1">
              Salsas a Elección incluidas:
            </span>
            <p className="leading-relaxed">
              {pastaSauces.join(' • ')}.
            </p>
          </div>
        )}

        {category.id === 'platos' && guarniciones.length > 0 && (
          <div className="mt-4 pt-3 border-t border-dashed border-[#d4cec0] bg-[#f8f6ee]/80 p-3 rounded-lg text-xs text-[#524e47]">
            <span className="font-bold text-[#b26649] uppercase tracking-wider block mb-1">
              Guarniciones a Elección:
            </span>
            <p className="leading-relaxed">
              {guarniciones.join(' • ')}.
            </p>
          </div>
        )}

        {category.id === 'empanadas' && (
          <div className="mt-3 pt-2.5 border-t border-dashed border-[#d4cec0] text-xs text-[#635f58] flex justify-between items-center">
            <span className="italic">Por docena o por unidad a elección.</span>
            <span className="font-semibold text-[#b26649]">Cocción al horno</span>
          </div>
        )}
      </div>
    </motion.section>
  );
};
