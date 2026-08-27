import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MenuProvider, useMenu } from './context/MenuContext';
import { MenuItem, DietTag } from './types';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { SearchBar } from './components/SearchBar';
import { MenuCategorySection } from './components/MenuCategorySection';
import { InfoModal } from './components/InfoModal';
import { QRModal } from './components/QRModal';
import { OfflineToast } from './components/OfflineToast';
import { BackToTop } from './components/BackToTop';
import { Footer } from './components/Footer';
import { IntroSplashScreen } from './components/IntroSplashScreen';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Utensils } from 'lucide-react';

function MenuContent() {
  const {
    categories,
    menuItems,
    restaurantInfo,
    pastaSauces,
    guarniciones,
    isAdminOpen,
    isAdminLoggedIn,
    setIsAdminOpen,
    setIsAdminLoggedIn,
  } = useMenu();

  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]?.id || 'pastas'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | DietTag>('all');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Sync active category if category list changes
  useEffect(() => {
    if (categories.length > 0 && !categories.some((c) => c.id === activeCategory)) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // Scroll spy to update active category in sticky nav during scrolling
  useEffect(() => {
    if (searchQuery.trim() !== '') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (const cat of categories) {
        const section = document.getElementById(`category-${cat.id}`);
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveCategory(cat.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories, searchQuery]);

  // Jump to category on click
  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (searchQuery || activeFilter !== 'all') {
      setSearchQuery('');
      setActiveFilter('all');
    }

    setTimeout(() => {
      const element = document.getElementById(`category-${categoryId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Focus search
  const handleFocusSearch = () => {
    searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 200);
  };

  // Handle Admin Trigger from invisible footer button
  const handleAdminTrigger = () => {
    if (isAdminLoggedIn) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminOpen(true);
  };

  // Filtered menu items
  const { filteredCategories, totalMatchingItems, isFiltered } = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const isSearchingOrFiltering = q !== '' || activeFilter !== 'all';

    const filtered = categories
      .map((category) => {
        const items = menuItems.filter((item) => {
          if (item.categoryId !== category.id) return false;

          // Apply tag filter
          if (activeFilter !== 'all') {
            if (!item.tags || !item.tags.includes(activeFilter)) {
              return false;
            }
          }

          // Apply query
          if (q !== '') {
            const nameMatch = item.name.toLowerCase().includes(q);
            const descMatch = item.description?.toLowerCase().includes(q) ?? false;
            const catMatch =
              category.name.toLowerCase().includes(q) ||
              category.shortName.toLowerCase().includes(q);
            const ingMatch =
              item.ingredients?.some((ing) => ing.toLowerCase().includes(q)) ?? false;
            return nameMatch || descMatch || catMatch || ingMatch;
          }

          return true;
        });

        return {
          category,
          items,
        };
      })
      .filter((group) => group.items.length > 0);

    const totalCount = filtered.reduce((sum, g) => sum + g.items.length, 0);

    return {
      filteredCategories: filtered,
      totalMatchingItems: totalCount,
      isFiltered: isSearchingOrFiltering,
    };
  }, [categories, menuItems, searchQuery, activeFilter]);

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#272624] flex flex-col font-sans selection:bg-[#b26649]/20 selection:text-[#b26649]">
      {/* Intro Splash Entrance Animation */}
      <IntroSplashScreen minDuration={2200} />

      {/* Top Header with Restaurant Crest & Botanical Art */}
      <Header
        onOpenInfo={() => setIsInfoOpen(true)}
        onOpenQR={() => setIsQROpen(true)}
        onFocusSearch={handleFocusSearch}
      />

      {/* Sticky Horizontal Category Nav */}
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Menu Body */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-4">
        {/* Search & Tags */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          totalResults={totalMatchingItems}
          isSearching={isFiltered}
          searchRef={searchInputRef}
        />

        {/* Categories / Menu Pages */}
        <div className="py-2">
          {filteredCategories.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-xl border border-[#ded8c9] p-6">
              <div className="w-12 h-12 rounded-full bg-[#f0ebd9] flex items-center justify-center text-[#8a8479] mb-3">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#272624] mb-1">
                No encontramos platos con "{searchQuery}"
              </h3>
              <p className="text-xs text-[#706b61] max-w-xs mb-4">
                Probá buscando por tipo de plato como "lomo", "pizza", "empanadas" o "pastas".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="px-4 py-2 rounded-full bg-[#b26649] text-white font-bold text-xs cursor-pointer"
              >
                Ver toda la carta
              </button>
            </div>
          ) : (
            filteredCategories.map(({ category, items }) => (
              <MenuCategorySection
                key={category.id}
                category={category}
                items={items}
                pastaSauces={pastaSauces}
                guarniciones={guarniciones}
              />
            ))
          )}
        </div>
      </main>

      {/* Footer with Invisible Admin Login Button on Copyright Text */}
      <Footer
        onOpenQR={() => setIsQROpen(true)}
        onOpenInfo={() => setIsInfoOpen(true)}
        onAdminTrigger={handleAdminTrigger}
        restaurantInfo={restaurantInfo}
      />

      {/* Info & WiFi Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        onOpenQR={() => {
          setIsInfoOpen(false);
          setIsQROpen(true);
        }}
        restaurantInfo={restaurantInfo}
      />

      {/* QR Code Sharing Modal */}
      <QRModal isOpen={isQROpen} onClose={() => setIsQROpen(false)} />

      {/* Admin Login Modal (Triggered invisibly from footer) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Admin Full Management Dashboard */}
      {isAdminOpen && <AdminDashboard />}

      {/* Offline Status Toast Notification */}
      <OfflineToast />

      {/* Back to Top */}
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <MenuProvider>
      <MenuContent />
    </MenuProvider>
  );
}
