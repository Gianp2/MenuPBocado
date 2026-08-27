import React from 'react';
import { Search, X } from 'lucide-react';
import { DietTag } from '../types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  activeFilter: 'all' | DietTag;
  onFilterChange: (val: 'all' | DietTag) => void;
  totalResults: number;
  isSearching: boolean;
  searchRef?: React.RefObject<HTMLInputElement | null>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  totalResults,
  isSearching,
  searchRef,
}) => {
  return (
    <div className="py-4">
      {/* Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-[#8a8479]" />
        <input
          ref={searchRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar plato, ingredientes o pizzas..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#ded8c9] text-xs sm:text-sm text-[#272624] placeholder-[#8a8479] focus:outline-none focus:border-[#b26649] focus:ring-1 focus:ring-[#b26649] transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 p-1 rounded-full text-[#8a8479] hover:text-[#272624] hover:bg-[#ede8db]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tag Chips */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-2.5 text-xs">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#272624] text-white shadow-xs'
              : 'bg-white/80 text-[#66625a] hover:bg-[#ede8db] border border-[#ded8c9]'
          }`}
        >
          Todos
        </button>

        <button
          onClick={() => onFilterChange('destacado')}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
            activeFilter === 'destacado'
              ? 'bg-[#b26649] text-white shadow-xs'
              : 'bg-white/80 text-[#66625a] hover:bg-[#ede8db] border border-[#ded8c9]'
          }`}
        >
          Destacados
        </button>

        <button
          onClick={() => onFilterChange('compartir')}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
            activeFilter === 'compartir'
              ? 'bg-[#5b7b68] text-white shadow-xs'
              : 'bg-white/80 text-[#66625a] hover:bg-[#ede8db] border border-[#ded8c9]'
          }`}
        >
          Para Compartir
        </button>

        <button
          onClick={() => onFilterChange('veggie')}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
            activeFilter === 'veggie'
              ? 'bg-[#5b7b68] text-white shadow-xs'
              : 'bg-white/80 text-[#66625a] hover:bg-[#ede8db] border border-[#ded8c9]'
          }`}
        >
          Opciones Veggie
        </button>
      </div>

      {isSearching && (
        <div className="text-center mt-2">
          <span className="text-[11px] text-[#7a756b] font-medium bg-[#f0ebe0]/60 px-2.5 py-0.5 rounded-full">
            {totalResults} resultado{totalResults === 1 ? '' : 's'} encontrado{totalResults === 1 ? '' : 's'}
          </span>
        </div>
      )}
    </div>
  );
};
