import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils,
  Layers,
  Sparkles,
  Store,
  Database,
  LogOut,
  TrendingUp,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { useMenu } from '../../context/MenuContext';
import { PuntoBocadoLogo } from '../PuntoBocadoLogo';

import { AdminItemsTab } from './AdminItemsTab';
import { AdminCategoriesTab } from './AdminCategoriesTab';
import { AdminExtrasTab } from './AdminExtrasTab';
import { AdminRestaurantInfoTab } from './AdminRestaurantInfoTab';
import { AdminBackupTab } from './AdminBackupTab';

import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';

type AdminTab =
  | 'items'
  | 'categories'
  | 'extras'
  | 'info'
  | 'backup';

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

  const [activeTab, setActiveTab] =
    useState<AdminTab>('items');

  const [statsOpen, setStatsOpen] =
    useState(false);

  useLockBodyScroll(isAdminOpen);

  if (!isAdminOpen) {
    return null;
  }

  // =========================================================
  // ACCIONES
  // =========================================================

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setIsAdminOpen(false);
  };

  const handleClose = () => {
    setIsAdminOpen(false);
  };

  // =========================================================
  // ESTADÍSTICAS
  // =========================================================

  const totalItems = menuItems.length;

  const totalCategories = categories.length;

  const totalExtras =
    pastaSauces.length + guarniciones.length;

  const avgPrice =
    totalItems > 0
      ? Math.round(
          menuItems.reduce(
            (total, item) => total + item.price,
            0
          ) / totalItems
        )
      : 0;

  const formattedAveragePrice =
    avgPrice.toLocaleString('es-AR');

  // =========================================================
  // ESTILO DE LOS BOTONES
  // =========================================================

  const tabButtonClass = (
    tab: AdminTab
  ) => `
    flex
    h-9
    min-w-0
    flex-1
    cursor-pointer
    items-center
    justify-center
    gap-1
    rounded-lg
    border
    px-1
    text-[9px]
    font-bold
    leading-none
    transition-all
    duration-200
    active:scale-[0.97]

    sm:h-10
    sm:gap-1.5
    sm:rounded-xl
    sm:px-2
    sm:text-xs

    ${
      activeTab === tab
        ? `
          border-[#c65526]
          bg-[#c65526]
          text-white
          shadow-sm
        `
        : `
          border-[#ded8c9]
          bg-white
          text-[#706b61]
          hover:border-[#c9c0ae]
          hover:bg-[#fcfbf8]
          hover:text-[#272624]
        `
    }
  `;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        flex-col
        overflow-hidden
        bg-[#f5f2e9]
        font-sans
        text-[#272624]
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          flex
          h-[52px]
          shrink-0
          items-center
          justify-between
          border-b
          border-[#ded8c9]
          bg-white
          px-2.5
          shadow-sm

          sm:h-[64px]
          sm:px-6
        "
      >
        {/* LOGO */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-2

            sm:gap-3
          "
        >
          <div
            className="
              h-7
              w-7
              shrink-0

              sm:h-9
              sm:w-9
            "
          >
            <PuntoBocadoLogo
              size="100%"
              showShadow={false}
            />
          </div>

          <div className="min-w-0">
            <div
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <span
                className="
                  max-w-[120px]
                  truncate
                  text-xs
                  font-extrabold
                  tracking-tight

                  sm:max-w-none
                  sm:text-base
                "
              >
                Punto Bocado
              </span>

              <span
                className="
                  shrink-0
                  rounded-md
                  bg-[#5b7b68]/10
                  px-1.5
                  py-0.5
                  text-[7px]
                  font-extrabold
                  uppercase
                  tracking-wider
                  text-[#5b7b68]

                  sm:text-[9px]
                "
              >
                Admin
              </span>
            </div>

            <p
              className="
                hidden
                text-[10px]
                text-[#8a8479]

                sm:block
              "
            >
              Gestión de carta
            </p>
          </div>
        </div>

        {/* ACCIONES */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-1
          "
        >
          <button
            type="button"
            onClick={handleClose}
            title="Volver a la carta"
            className="
              flex
              h-8
              cursor-pointer
              items-center
              justify-center
              gap-1
              rounded-lg
              border
              border-[#ded8c9]
              bg-white
              px-2
              text-[9px]
              font-bold
              text-[#272624]
              shadow-sm
              transition-all
              hover:bg-[#f5f2e9]
              active:scale-95

              sm:h-9
              sm:gap-1.5
              sm:rounded-xl
              sm:px-3
              sm:text-xs
            "
          >
            <ArrowLeft
              className="
                h-3.5
                w-3.5
                text-[#c65526]

                sm:h-4
                sm:w-4
              "
            />

            <span>Ver Carta</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="
              flex
              h-8
              w-8
              cursor-pointer
              items-center
              justify-center
              rounded-lg
              text-[#8a8479]
              transition-all
              hover:bg-red-50
              hover:text-red-700
              active:scale-95

              sm:h-9
              sm:w-9
              sm:rounded-xl
            "
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* =====================================================
          CONTENIDO PRINCIPAL
      ====================================================== */}

      <main
        className="
          mx-auto
          flex
          w-full
          max-w-6xl
          flex-1
          min-h-0
          flex-col
          overflow-hidden
          px-2
          py-2

          sm:px-6
          sm:py-4
        "
      >
        {/* ===================================================
            RESUMEN
        ==================================================== */}

        <div className="shrink-0">
          <button
            type="button"
            onClick={() =>
              setStatsOpen(
                (previous) => !previous
              )
            }
            aria-expanded={statsOpen}
            className="
              flex
              h-9
              w-full
              cursor-pointer
              items-center
              justify-between
              rounded-xl
              border
              border-[#ded8c9]
              bg-white
              px-2.5
              shadow-sm
              transition-all
              hover:border-[#c9c0ae]
              active:scale-[0.995]

              sm:h-11
              sm:rounded-2xl
              sm:px-4
            "
          >
            <div
              className="
                flex
                min-w-0
                items-center
                gap-2
              "
            >
              <div
                className="
                  flex
                  h-6
                  w-6
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#c65526]/10
                  text-[#c65526]

                  sm:h-8
                  sm:w-8
                "
              >
                <TrendingUp
                  className="
                    h-3
                    w-3

                    sm:h-4
                    sm:w-4
                  "
                />
              </div>

              <div className="min-w-0 text-left">
                <span
                  className="
                    block
                    text-[10px]
                    font-extrabold
                    leading-none

                    sm:text-xs
                  "
                >
                  Resumen del menú
                </span>

                {!statsOpen && (
                  <span
                    className="
                      mt-0.5
                      block
                      truncate
                      text-[8px]
                      leading-none
                      text-[#8a8479]

                      sm:text-[10px]
                    "
                  >
                    {totalItems} platos ·{' '}
                    {totalCategories} categorías ·{' '}
                    {totalExtras} extras · $
                    {formattedAveragePrice}
                  </span>
                )}
              </div>
            </div>

            <div
              className="
                flex
                shrink-0
                items-center
                gap-1
                text-[#8a8479]
              "
            >
              <span
                className="
                  hidden
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-wider

                  sm:block
                "
              >
                {statsOpen
                  ? 'Ocultar'
                  : 'Mostrar'}
              </span>

              <div
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-md
                  bg-[#f5f2e9]

                  sm:h-7
                  sm:w-7
                "
              >
                {statsOpen ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </div>
            </div>
          </button>
        </div>

        {/* ===================================================
            ESTADÍSTICAS
        ==================================================== */}

        <AnimatePresence initial={false}>
          {statsOpen && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: 'auto',
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.18,
              }}
              className="
                shrink-0
                overflow-hidden
              "
            >
              <div
                className="
                  mt-1.5
                  grid
                  grid-cols-4
                  gap-1.5

                  sm:mt-2
                  sm:gap-2.5
                "
              >
                {/* PLATOS */}

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#ded8c9]
                    bg-white
                    px-1
                    py-1.5
                    shadow-sm

                    sm:justify-start
                    sm:gap-2
                    sm:px-3
                    sm:py-2.5
                  "
                >
                  <div
                    className="
                      hidden
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#c65526]/10
                      text-[#c65526]

                      sm:flex
                    "
                  >
                    <Utensils className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0 text-center sm:text-left">
                    <span
                      className="
                        block
                        truncate
                        text-[7px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-[#8a8479]

                        sm:text-[8px]
                      "
                    >
                      Platos
                    </span>

                    <span
                      className="
                        block
                        text-sm
                        font-black

                        sm:text-lg
                      "
                    >
                      {totalItems}
                    </span>
                  </div>
                </div>

                {/* CATEGORÍAS */}

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#ded8c9]
                    bg-white
                    px-1
                    py-1.5
                    shadow-sm

                    sm:justify-start
                    sm:gap-2
                    sm:px-3
                    sm:py-2.5
                  "
                >
                  <div
                    className="
                      hidden
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#5b7b68]/10
                      text-[#5b7b68]

                      sm:flex
                    "
                  >
                    <Layers className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0 text-center sm:text-left">
                    <span
                      className="
                        block
                        truncate
                        text-[7px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-[#8a8479]

                        sm:text-[8px]
                      "
                    >
                      Categorías
                    </span>

                    <span
                      className="
                        block
                        text-sm
                        font-black

                        sm:text-lg
                      "
                    >
                      {totalCategories}
                    </span>
                  </div>
                </div>

                {/* EXTRAS */}

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#ded8c9]
                    bg-white
                    px-1
                    py-1.5
                    shadow-sm

                    sm:justify-start
                    sm:gap-2
                    sm:px-3
                    sm:py-2.5
                  "
                >
                  <div
                    className="
                      hidden
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-amber-500/10
                      text-amber-700

                      sm:flex
                    "
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0 text-center sm:text-left">
                    <span
                      className="
                        block
                        truncate
                        text-[7px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-[#8a8479]

                        sm:text-[8px]
                      "
                    >
                      Extras
                    </span>

                    <span
                      className="
                        block
                        text-sm
                        font-black

                        sm:text-lg
                      "
                    >
                      {totalExtras}
                    </span>
                  </div>
                </div>

                {/* PROMEDIO */}

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#ded8c9]
                    bg-white
                    px-1
                    py-1.5
                    shadow-sm

                    sm:justify-start
                    sm:gap-2
                    sm:px-3
                    sm:py-2.5
                  "
                >
                  <div
                    className="
                      hidden
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-emerald-500/10
                      text-emerald-700

                      sm:flex
                    "
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0 text-center sm:text-left">
                    <span
                      className="
                        block
                        truncate
                        text-[7px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-[#8a8479]

                        sm:text-[8px]
                      "
                    >
                      Promedio
                    </span>

                    <span
                      className="
                        block
                        truncate
                        text-xs
                        font-black

                        sm:text-lg
                      "
                    >
                      ${formattedAveragePrice}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================================
            BOTONES DE SECCIONES
        ==================================================== */}

        <nav
          className="
            mt-2
            flex
            w-full
            shrink-0
            items-center
            justify-center
            gap-1

            sm:mt-3
            sm:gap-1.5
          "
        >
          {/* PLATOS */}

          <button
            type="button"
            onClick={() =>
              setActiveTab('items')
            }
            className={tabButtonClass('items')}
          >
            <Utensils
              className="
                h-3
                w-3
                shrink-0

                sm:h-4
                sm:w-4
              "
            />

            <span className="truncate">
              Platos
            </span>
          </button>

          {/* CATEGORÍAS */}

          <button
            type="button"
            onClick={() =>
              setActiveTab('categories')
            }
            className={tabButtonClass(
              'categories'
            )}
          >
            <Layers
              className="
                h-3
                w-3
                shrink-0

                sm:h-4
                sm:w-4
              "
            />

            <span className="truncate">
              Categorías
            </span>
          </button>

          {/* EXTRAS */}

          <button
            type="button"
            onClick={() =>
              setActiveTab('extras')
            }
            className={tabButtonClass('extras')}
          >
            <Sparkles
              className="
                h-3
                w-3
                shrink-0

                sm:h-4
                sm:w-4
              "
            />

            <span className="truncate">
              Extras
            </span>
          </button>

          {/* SALÓN */}

          <button
            type="button"
            onClick={() =>
              setActiveTab('info')
            }
            className={tabButtonClass('info')}
          >
            <Store
              className="
                h-3
                w-3
                shrink-0

                sm:h-4
                sm:w-4
              "
            />

            <span className="truncate">
              Salón
            </span>
          </button>

          {/* RESPALDO */}

          <button
            type="button"
            onClick={() =>
              setActiveTab('backup')
            }
            className={tabButtonClass('backup')}
          >
            <Database
              className="
                h-3
                w-3
                shrink-0

                sm:h-4
                sm:w-4
              "
            />

            <span className="truncate">
              Respaldo
            </span>
          </button>
        </nav>

        {/* ===================================================
            CONTENIDO DE LA SECCIÓN
        ==================================================== */}

        <section
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            pb-3
            pt-2

            sm:pb-5
            sm:pt-3
          "
        >
          {/* PLATOS */}

          {activeTab === 'items' && (
            <AdminItemsTab
              items={menuItems}
              categories={categories}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onDeleteItem={deleteItem}
              onDuplicateItem={
                duplicateItem
              }
              onBulkUpdatePrices={
                bulkUpdatePrices
              }
            />
          )}

          {/* CATEGORÍAS */}

          {activeTab === 'categories' && (
            <AdminCategoriesTab
              categories={categories}
              items={menuItems}
              onAddCategory={
                addCategory
              }
              onUpdateCategory={
                updateCategory
              }
              onDeleteCategory={
                deleteCategory
              }
              onReorderCategories={
                reorderCategories
              }
            />
          )}

          {/* EXTRAS */}

          {activeTab === 'extras' && (
            <AdminExtrasTab
              pastaSauces={pastaSauces}
              guarniciones={guarniciones}
              onAddSauce={addPastaSauce}
              onRemoveSauce={
                removePastaSauce
              }
              onAddGuarnicion={
                addGuarnicion
              }
              onRemoveGuarnicion={
                removeGuarnicion
              }
            />
          )}

          {/* SALÓN */}

          {activeTab === 'info' && (
            <AdminRestaurantInfoTab
              info={restaurantInfo}
              onSave={
                updateRestaurantInfo
              }
            />
          )}

          {/* RESPALDO */}

          {activeTab === 'backup' && (
            <AdminBackupTab
              onExportJSON={
                exportDataJSON
              }
              onImportJSON={
                importDataJSON
              }
              onResetToDefaults={
                resetToDefaults
              }
              onSyncCloud={
                syncToCloudNow
              }
              isFirebaseConnected={
                isFirebaseConnected
              }
              isFirebaseSyncing={
                isFirebaseSyncing
              }
            />
          )}
        </section>
      </main>
    </div>
  );
};
