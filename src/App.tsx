import React, { useState, useEffect } from 'react';
import initialData from './data/food-log.json';
import type { FoodLogData, FoodEntry, WishlistItem } from './types/foodLog';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { SearchRecallBar } from './components/SearchRecallBar';
import { RestaurantCard } from './components/RestaurantCard';
import { DishList } from './components/DishList';
import { WishlistSection } from './components/WishlistSection';
import { NeverAgainList } from './components/NeverAgainList';
import { AddOrderModal } from './components/AddOrderModal';
import { Store, UtensilsCrossed, Sparkles, AlertOctagon } from 'lucide-react';

const STORAGE_KEY = 'taste_vault_food_data_v2';

export const App: React.FC = () => {
  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taste_vault_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Food log data state (localStorage cached or initial seed)
  const [foodData, setFoodData] = useState<FoodLogData>(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('taste_vault_food_data_v1');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.version === '2.0.0') {
            return parsed;
          }
        } catch {
          // fallback to initialData
        }
      }
    }
    return initialData as FoodLogData;
  });

  // Active view tab
  const [activeTab, setActiveTab] = useState<'restaurants' | 'dishes' | 'wishlist' | 'never-again'>('restaurants');

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [initialModalRestName, setInitialModalRestName] = useState('');
  const [initialModalDishName, setInitialModalDishName] = useState('');

  // Persist dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('taste_vault_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('taste_vault_theme', 'light');
    }
  }, [darkMode]);

  // Persist data changes to localStorage
  const saveFoodData = (newData: FoodLogData) => {
    setFoodData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {
      // ignore
    }
  };

  // Add new order
  const handleSaveOrder = (newEntry: FoodEntry) => {
    const updatedEntries = [newEntry, ...foodData.entries];

    // Update restaurant or add if new
    let updatedRestaurants = [...foodData.restaurants];
    const existingIndex = updatedRestaurants.findIndex(
      r => r.name.toLowerCase() === newEntry.restaurantName.toLowerCase()
    );

    if (existingIndex >= 0) {
      const existing = updatedRestaurants[existingIndex];
      updatedRestaurants[existingIndex] = {
        ...existing,
        visitedCount: existing.visitedCount + 1,
        lastVisited: newEntry.orderDate,
      };
    } else {
      updatedRestaurants.push({
        id: newEntry.restaurantId,
        name: newEntry.restaurantName,
        cuisine: ['Eatery'],
        visitedCount: 1,
        lastVisited: newEntry.orderDate,
        overallRating: 4.5,
      });
    }

    const updatedData: FoodLogData = {
      ...foodData,
      lastUpdated: new Date().toISOString(),
      restaurants: updatedRestaurants,
      entries: updatedEntries,
    };

    saveFoodData(updatedData);
  };

  // Add Wishlist item
  const handleAddWishlistItem = (item: Omit<WishlistItem, 'id'>) => {
    const newItem: WishlistItem = {
      ...item,
      id: `wish-${Date.now()}`,
    };
    const updatedData: FoodLogData = {
      ...foodData,
      wishlist: [...foodData.wishlist, newItem],
    };
    saveFoodData(updatedData);
  };

  // Remove Wishlist item
  const handleRemoveWishlistItem = (id: string) => {
    const updatedData: FoodLogData = {
      ...foodData,
      wishlist: foodData.wishlist.filter(w => w.id !== id),
    };
    saveFoodData(updatedData);
  };

  // Mark wishlist item as eaten (opens order modal prefilled)
  const handleMarkAsOrdered = (item: WishlistItem) => {
    setInitialModalRestName(item.restaurantName);
    setInitialModalDishName(item.itemName);
    setIsAddModalOpen(true);
    // remove from wishlist
    handleRemoveWishlistItem(item.id);
  };

  // Export JSON file
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(foodData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'food-log.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] dark:bg-[#151821] text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenAddModal={() => {
          setInitialModalRestName('');
          setInitialModalDishName('');
          setIsAddModalOpen(true);
        }}
        onExportData={handleExportData}
        totalPlaces={foodData.restaurants.length}
        totalDishes={foodData.entries.reduce((acc, curr) => acc + curr.items.length, 0)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {/* Instant Don't-Repeat Search Recall Bar */}
        <SearchRecallBar
          data={foodData}
          onSelectRestaurant={() => {
            setActiveTab('restaurants');
          }}
        />

        {/* Stats Metric Cards */}
        <StatsCards data={foodData} />

        {/* Navigation Tabs (Neumorphic Inset/Flat Pills) */}
        <div className="my-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'restaurants'
                ? 'bg-amber-500 text-white shadow-neu-sm'
                : 'bg-[#eef2f7] dark:bg-[#1c212d] shadow-neu-sm dark:shadow-neu-dark-sm active:shadow-neu-sm-pressed dark:active:shadow-neu-dark-sm-pressed text-slate-600 dark:text-slate-300'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Eateries &amp; Spots ({foodData.restaurants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dishes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'dishes'
                ? 'bg-amber-500 text-white shadow-neu-sm'
                : 'bg-[#eef2f7] dark:bg-[#1c212d] shadow-neu-sm dark:shadow-neu-dark-sm active:shadow-neu-sm-pressed dark:active:shadow-neu-dark-sm-pressed text-slate-600 dark:text-slate-300'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>
              All Dishes Eaten ({foodData.entries.reduce((acc, curr) => acc + curr.items.length, 0)})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'wishlist'
                ? 'bg-indigo-600 text-white shadow-neu-sm'
                : 'bg-[#eef2f7] dark:bg-[#1c212d] shadow-neu-sm dark:shadow-neu-dark-sm active:shadow-neu-sm-pressed dark:active:shadow-neu-dark-sm-pressed text-slate-600 dark:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>To Try Next &bull; Wishlist ({foodData.wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('never-again')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'never-again'
                ? 'bg-red-600 text-white shadow-neu-sm'
                : 'bg-[#eef2f7] dark:bg-[#1c212d] shadow-neu-sm dark:shadow-neu-dark-sm active:shadow-neu-sm-pressed dark:active:shadow-neu-dark-sm-pressed text-slate-600 dark:text-slate-300'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Never Again &bull; Avoid</span>
          </button>
        </div>

        {/* Tab Content */}
        <section className="mt-4">
          {activeTab === 'restaurants' && (
            <div className="space-y-5">
              {foodData.restaurants.map((rest) => {
                const restEntries = foodData.entries.filter(
                  e => e.restaurantName.toLowerCase() === rest.name.toLowerCase()
                );
                const restWishlist = foodData.wishlist.filter(
                  w => w.restaurantName.toLowerCase() === rest.name.toLowerCase()
                );

                return (
                  <RestaurantCard
                    key={rest.id}
                    restaurant={rest}
                    entries={restEntries}
                    wishlist={restWishlist}
                    onAddWishlistItem={(restName) => {
                      setInitialModalRestName(restName);
                      setActiveTab('wishlist');
                    }}
                  />
                );
              })}
            </div>
          )}

          {activeTab === 'dishes' && <DishList data={foodData} />}

          {activeTab === 'wishlist' && (
            <WishlistSection
              wishlist={foodData.wishlist}
              onAddWishlistItem={handleAddWishlistItem}
              onRemoveWishlistItem={handleRemoveWishlistItem}
              onMarkAsOrdered={handleMarkAsOrdered}
            />
          )}

          {activeTab === 'never-again' && <NeverAgainList data={foodData} />}
        </section>
      </main>

      {/* Add / Log Order Modal */}
      <AddOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaveOrder={handleSaveOrder}
        initialRestaurantName={initialModalRestName}
        initialDishName={initialModalDishName}
      />
    </div>
  );
};

export default App;
