import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Utensils,
  Layers,
  Sparkles,
  Store,
  Database,
  ExternalLink,
  LogOut,
  ShieldCheck,
  TrendingUp,
  Tag,
  DollarSign,
  Coffee,
  ChefHat,
  ArrowLeft
} from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { PuntoBocadoLogo } from '../PuntoBocadoLogo';
import { AdminItemsTab } from './AdminItemsTab';
import { AdminCategoriesTab } from './AdminCategoriesTab';
import { AdminExtrasTab } from './AdminExtrasTab';
import { AdminRestaurantInfoTab } from './AdminRestaurantInfoTab';
import { AdminBackupTab } from './AdminBackupTab';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';

type AdminTab = 'items' | 'categories' | 'extras' | 'info' | 'backup';

export const AdminDashboard: React.FC = () => {
  const {
    categories,
    menuItems,
    restaurantInfo,
    pastaSauces,
    guarniciones,
    isAdminOpen,
    isFirebaseConnected,
    isFirebaseSyncing,
    setIsAdminOpen,
    setIsAdminLoggedIn,
    addItem,
    updateItem,
    deleteItem,
    duplicateItem,
    bulkUpdatePrices,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addPastaSauce,
    removePastaSauce,
    addGuarnicion,
    removeGuarnicion,
    updateRestaurantInfo,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,
    syncToCloudNow,
  } = useMenu();

  const [activeTab, setActiveTab] = useState<AdminTab>('items');

  useLockBodyScroll(isAdminOpen);

  if (!isAdminOpen) return null;

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setIsAdminOpen(false);
  };

  const handleClose = () => {
    setIsAdminOpen(false);
  };

  // Stats calculation
  const totalItems = menuItems.length;
  const totalCategories = categories.length;
  const avgPrice = totalItems > 0
    ? Math.round(menuItems.reduce((acc, i) => acc + i.price, 0) / totalItems)
    : 0;

  return (
    <div className="fixed inset-0 z-[100] bg-[#f5f2e9] text-[#272624] flex flex-col overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#ded8c9] px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between shadow-2xs z-10 shrink-0">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0">
            <PuntoBocadoLogo size="100%" showShadow={false} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-[#272624] tracking-tight truncate">
                Punto Bocado
              </span>
              <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-[#5b7b68]/15 text-[#5b7b68] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider shrink-0">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-[#706b61] hidden sm:block truncate">
              Gestor integral de carta, precios, categorías y salón
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={handleClose}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white border border-[#ded8c9] hover:bg-[#ede8db] text-xs font-bold text-[#272624] flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-2xs"
            title="Volver a la carta del cliente"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#c65526]" />
            <span className="hidden sm:inline">Ver Carta en Vivo</span>
            <span className="sm:hidden">Ver Carta</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 sm:p-2 rounded-xl text-[#8a8479] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
            title="Cerrar sesión de administrador"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden max-w-6xl w-full mx-auto p-2.5 sm:p-6">
        {/* Top Quick Stats Grid - 2 cols on mobile, 4 cols on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 mb-3 sm:mb-4 shrink-0">
          <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#ded8c9] shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c65526]/10 text-[#c65526] flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8a8479] uppercase block truncate">Platos</span>
              <span className="text-lg sm:text-xl font-extrabold text-[#272624] leading-tight block">{totalItems}</span>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#ded8c9] shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5b7b68]/10 text-[#5b7b68] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8a8479] uppercase block truncate">Categorías</span>
              <span className="text-lg sm:text-xl font-extrabold text-[#272624] leading-tight block">{totalCategories}</span>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#ded8c9] shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8a8479] uppercase block truncate">Salsas & Minutas</span>
              <span className="text-lg sm:text-xl font-extrabold text-[#272624] leading-tight block">{pastaSauces.length + guarniciones.length}</span>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#ded8c9] shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8a8479] uppercase block truncate">Promedio</span>
              <span className="text-lg sm:text-xl font-extrabold text-[#272624] leading-tight block">${avgPrice.toLocaleString('es-AR')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation with touch-friendly pills (min-height 44px on mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[#ded8c9] mb-3 sm:mb-4 overflow-x-auto no-scrollbar pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('items')}
            className={`min-h-[44px] px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
              activeTab === 'items'
                ? 'bg-[#c65526] text-white shadow-xs'
                : 'text-[#706b61] hover:text-[#272624] hover:bg-[#ede8db] bg-white/70 border border-[#ded8c9]/70'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Platos & Precios</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`min-h-[44px] px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
              activeTab === 'categories'
                ? 'bg-[#c65526] text-white shadow-xs'
                : 'text-[#706b61] hover:text-[#272624] hover:bg-[#ede8db] bg-white/70 border border-[#ded8c9]/70'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categorías</span>
          </button>

          <button
            onClick={() => setActiveTab('extras')}
            className={`min-h-[44px] px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
              activeTab === 'extras'
                ? 'bg-[#c65526] text-white shadow-xs'
                : 'text-[#706b61] hover:text-[#272624] hover:bg-[#ede8db] bg-white/70 border border-[#ded8c9]/70'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Salsas & Minutas</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`min-h-[44px] px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
              activeTab === 'info'
                ? 'bg-[#c65526] text-white shadow-xs'
                : 'text-[#706b61] hover:text-[#272624] hover:bg-[#ede8db] bg-white/70 border border-[#ded8c9]/70'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Datos del Salón</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`min-h-[44px] px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
              activeTab === 'backup'
                ? 'bg-[#c65526] text-white shadow-xs'
                : 'text-[#706b61] hover:text-[#272624] hover:bg-[#ede8db] bg-white/70 border border-[#ded8c9]/70'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Copia / Respaldo</span>
          </button>
        </div>

        {/* Tab Content (Scrollable Container) */}
        <div className="flex-1 overflow-y-auto pr-1 pb-6">
          {activeTab === 'items' && (
            <AdminItemsTab
              items={menuItems}
              categories={categories}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onDeleteItem={deleteItem}
              onDuplicateItem={duplicateItem}
              onBulkUpdatePrices={bulkUpdatePrices}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategoriesTab
              categories={categories}
              items={menuItems}
              onAddCategory={addCategory}
              onUpdateCategory={updateCategory}
              onDeleteCategory={deleteCategory}
              onReorderCategories={reorderCategories}
            />
          )}

          {activeTab === 'extras' && (
            <AdminExtrasTab
              pastaSauces={pastaSauces}
              guarniciones={guarniciones}
              onAddSauce={addPastaSauce}
              onRemoveSauce={removePastaSauce}
              onAddGuarnicion={addGuarnicion}
              onRemoveGuarnicion={removeGuarnicion}
            />
          )}

          {activeTab === 'info' && (
            <AdminRestaurantInfoTab
              info={restaurantInfo}
              onSave={updateRestaurantInfo}
            />
          )}

          {activeTab === 'backup' && (
            <AdminBackupTab
              onExportJSON={exportDataJSON}
              onImportJSON={importDataJSON}
              onResetToDefaults={resetToDefaults}
              onSyncCloud={syncToCloudNow}
              isFirebaseConnected={isFirebaseConnected}
              isFirebaseSyncing={isFirebaseSyncing}
            />
          )}
        </div>
      </div>
    </div>
  );
};
