import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Utensils, Check, X } from 'lucide-react';

interface AdminExtrasTabProps {
  pastaSauces: string[];
  guarniciones: string[];
  onAddSauce: (sauce: string) => void;
  onRemoveSauce: (index: number) => void;
  onAddGuarnicion: (side: string) => void;
  onRemoveGuarnicion: (index: number) => void;
}

export const AdminExtrasTab: React.FC<AdminExtrasTabProps> = ({
  pastaSauces,
  guarniciones,
  onAddSauce,
  onRemoveSauce,
  onAddGuarnicion,
  onRemoveGuarnicion,
}) => {
  const [newSauce, setNewSauce] = useState('');
  const [newSide, setNewSide] = useState('');

  const handleAddSauce = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSauce.trim()) {
      onAddSauce(newSauce.trim());
      setNewSauce('');
    }
  };

  const handleAddSide = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSide.trim()) {
      onAddGuarnicion(newSide.trim());
      setNewSide('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Salsas de Pastas */}
      <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#ded8c9] shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-bold text-sm sm:text-base text-[#272624]">
              Salsas para Pastas ({pastaSauces.length})
            </h3>
            <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#c65526]/10 text-[#c65526]">
              A elección
            </span>
          </div>
          <p className="text-xs text-[#706b61] mb-3">
            Opciones que se muestran en el selector de salsas caseras para ñoquis, ravioles, etc.
          </p>

          {/* Form to add sauce */}
          <form onSubmit={handleAddSauce} className="flex gap-2 mb-3 sm:mb-4">
            <input
              type="text"
              value={newSauce}
              onChange={(e) => setNewSauce(e.target.value)}
              placeholder="Nueva salsa (ej: Cuatro Quesos)..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#fcfbf7] border border-[#ded8c9] text-xs sm:text-sm text-[#272624] placeholder-[#a09a8e] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
            />
            <button
              type="submit"
              disabled={!newSauce.trim()}
              className="px-3.5 py-2 rounded-xl bg-[#c65526] hover:bg-[#b0481d] active:scale-95 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          </form>

          {/* Sauces list */}
          <div className="space-y-1.5 max-h-[300px] sm:max-h-[360px] overflow-y-auto pr-1">
            {pastaSauces.map((sauce, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#fcfbf7] border border-[#e8e2d4] text-xs text-[#272624]"
              >
                <span className="font-medium">• {sauce}</span>
                <button
                  onClick={() => onRemoveSauce(idx)}
                  className="p-1.5 rounded-md text-[#a09a8e] hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  title="Eliminar salsa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guarniciones & Acompañamientos */}
      <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#ded8c9] shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-bold text-sm sm:text-base text-[#272624]">
              Guarniciones & Minutas ({guarniciones.length})
            </h3>
            <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#5b7b68]/10 text-[#5b7b68]">
              Acompañamientos
            </span>
          </div>
          <p className="text-xs text-[#706b61] mb-3">
            Opciones de guarnición para milanesas, bifes, supremas y platos al plato.
          </p>

          {/* Form to add side */}
          <form onSubmit={handleAddSide} className="flex gap-2 mb-3 sm:mb-4">
            <input
              type="text"
              value={newSide}
              onChange={(e) => setNewSide(e.target.value)}
              placeholder="Nueva guarnición (ej: Papas rústicas)..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#fcfbf7] border border-[#ded8c9] text-xs sm:text-sm text-[#272624] placeholder-[#a09a8e] focus:outline-none focus:ring-2 focus:ring-[#5b7b68]"
            />
            <button
              type="submit"
              disabled={!newSide.trim()}
              className="px-3.5 py-2 rounded-xl bg-[#5b7b68] hover:bg-[#4d6958] active:scale-95 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          </form>

          {/* Sides list */}
          <div className="space-y-1.5 max-h-[300px] sm:max-h-[360px] overflow-y-auto pr-1">
            {guarniciones.map((side, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#fcfbf7] border border-[#e8e2d4] text-xs text-[#272624]"
              >
                <span className="font-medium">• {side}</span>
                <button
                  onClick={() => onRemoveGuarnicion(idx)}
                  className="p-1.5 rounded-md text-[#a09a8e] hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  title="Eliminar guarnición"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
