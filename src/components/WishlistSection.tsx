import React, { useState } from 'react';
import { Sparkles, Plus, Check, Trash2 } from 'lucide-react';
import type { WishlistItem } from '../types/foodLog';

interface WishlistSectionProps {
  wishlist: WishlistItem[];
  onAddWishlistItem: (item: Omit<WishlistItem, 'id'>) => void;
  onRemoveWishlistItem: (id: string) => void;
  onMarkAsOrdered: (item: WishlistItem) => void;
}

export const WishlistSection: React.FC<WishlistSectionProps> = ({
  wishlist,
  onAddWishlistItem,
  onRemoveWishlistItem,
  onMarkAsOrdered,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [itemName, setItemName] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [reasonToTry, setReasonToTry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName || !itemName) return;

    onAddWishlistItem({
      restaurantName,
      restaurantId: restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      itemName,
      targetPrice: targetPrice ? Number(targetPrice) : undefined,
      reasonToTry,
    });

    setRestaurantName('');
    setItemName('');
    setTargetPrice('');
    setReasonToTry('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
              Menu Wishlist &bull; Next In Line To Try
            </h3>
            <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80">
              Dishes you saw on the menu card or Swiggy that you want to try on your next visit instead of repeating!
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-neu-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Wishlist Item</span>
        </button>
      </div>

      {/* Add Wishlist Item Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-2xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-flat dark:shadow-neu-dark-flat border border-indigo-500/30 space-y-3"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Add A Dish You Want To Try Next
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Restaurant Name *
              </label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. Joey's Pizza, Truffles"
                className="w-full px-3 py-2 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Dish / Drink Name *
              </label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Tornado Chicken Pizza"
                className="w-full px-3 py-2 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Estimated Price (₹)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="e.g. 450"
                className="w-full px-3 py-2 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Why do you want to try it? / Notes
            </label>
            <input
              type="text"
              value={reasonToTry}
              onChange={(e) => setReasonToTry(e.target.value)}
              placeholder="e.g. Chef's recommendation, looks amazing on Instagram, etc."
              className="w-full px-3 py-2 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs text-slate-800 dark:text-slate-100 font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-neu-sm transition"
            >
              Save to Wishlist
            </button>
          </div>
        </form>
      )}

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {wishlist.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Sparkles className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              No wishlist items yet. Add dishes from menus that catch your eye!
            </p>
          </div>
        ) : (
          wishlist.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-sm dark:shadow-neu-dark-sm hover:shadow-neu-flat dark:hover:shadow-neu-dark-flat transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {item.itemName}
                    </h4>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      At {item.restaurantName}
                    </span>
                  </div>

                  {item.targetPrice && (
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-sm-pressed dark:shadow-neu-dark-sm-pressed">
                      ₹{item.targetPrice}
                    </span>
                  )}
                </div>

                {item.reasonToTry && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic bg-slate-200/40 dark:bg-slate-800/40 p-2 rounded-xl">
                    &ldquo;{item.reasonToTry}&rdquo;
                  </p>
                )}
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onMarkAsOrdered(item)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition"
                  title="Move to logged orders"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>I Ate This Today!</span>
                </button>

                <button
                  onClick={() => onRemoveWishlistItem(item.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
