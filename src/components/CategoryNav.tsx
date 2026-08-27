import React, { useRef, useEffect } from 'react';
import { Category } from '../types';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll the pill list to keep active category in view
  useEffect(() => {
    if (activeBtnRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const button = activeBtnRef.current;
      const leftPos = button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, leftPos),
        behavior: 'smooth',
      });
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-0 z-30 bg-[#fbfaf6]/95 backdrop-blur-md border-b border-[#e6e1d5] py-2.5 shadow-2xs">
      <div className="max-w-4xl mx-auto px-3">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                ref={isActive ? activeBtnRef : null}
                onClick={() => onSelectCategory(category.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#b26649] text-white shadow-xs'
                    : 'bg-white/80 text-[#55524c] hover:bg-[#ede8db] border border-[#ded8c9]'
                }`}
              >
                {category.shortName || category.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
