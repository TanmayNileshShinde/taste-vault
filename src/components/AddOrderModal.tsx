import React, { useState } from 'react';
import { X, Plus, Trash2, Receipt, Star } from 'lucide-react';
import type { FoodEntry, OrderSource, FoodVerdict } from '../types/foodLog';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveOrder: (newEntry: FoodEntry) => void;
  initialRestaurantName?: string;
  initialDishName?: string;
}

export const AddOrderModal: React.FC<AddOrderModalProps> = ({
  isOpen,
  onClose,
  onSaveOrder,
  initialRestaurantName = '',
  initialDishName = '',
}) => {
  const [restaurantName, setRestaurantName] = useState(initialRestaurantName);
  const [orderDate, setOrderDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [orderSource, setOrderSource] = useState<OrderSource>('Swiggy');
  const [billTotal, setBillTotal] = useState('');
  const [receiptNotes, setReceiptNotes] = useState('');

  const [dishes, setDishes] = useState<Array<{
    name: string;
    category: string;
    price: string;
    rating: number;
    verdict: FoodVerdict;
    doNotRepeat: boolean;
    notes: string;
  }>>([
    {
      name: initialDishName,
      category: 'Main Course',
      price: '',
      rating: 4,
      verdict: 'Good',
      doNotRepeat: true,
      notes: '',
    },
  ]);

  if (!isOpen) return null;

  const handleAddDish = () => {
    setDishes([
      ...dishes,
      {
        name: '',
        category: 'Main Course',
        price: '',
        rating: 4,
        verdict: 'Good',
        doNotRepeat: true,
        notes: '',
      },
    ]);
  };

  const handleRemoveDish = (index: number) => {
    if (dishes.length === 1) return;
    setDishes(dishes.filter((_, i) => i !== index));
  };

  const handleDishChange = (index: number, field: string, value: any) => {
    const updated = [...dishes];
    updated[index] = { ...updated[index], [field]: value };
    setDishes(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName.trim() || dishes.some(d => !d.name.trim())) return;

    const restSlug = restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newEntry: FoodEntry = {
      id: `entry-${Date.now()}`,
      restaurantId: restSlug,
      restaurantName: restaurantName.trim(),
      orderDate,
      orderSource,
      billTotal: billTotal ? Number(billTotal) : undefined,
      receiptNotes: receiptNotes.trim() || undefined,
      items: dishes.map((d, i) => ({
        id: `item-${Date.now()}-${i}`,
        name: d.name.trim(),
        category: d.category || 'Main Course',
        price: d.price ? Number(d.price) : undefined,
        rating: d.rating,
        verdict: d.verdict,
        doNotRepeat: d.doNotRepeat,
        notes: d.notes.trim() || undefined,
      })),
    };

    onSaveOrder(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-flat dark:shadow-neu-dark-flat p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-pressed dark:shadow-neu-dark-pressed text-amber-500">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Log New Eatery Order &bull; Bill
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Add dishes you ate so you don&apos;t repeat them next time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-sm dark:shadow-neu-dark-sm transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Order Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Restaurant / Eatery Name *
              </label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. Joey's Pizza, Café Madras, Bastian"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Order Date
              </label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Order Source
              </label>
              <select
                value={orderSource}
                onChange={(e) => setOrderSource(e.target.value as OrderSource)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs text-slate-800 dark:text-slate-100 font-medium"
              >
                <option value="Swiggy">Swiggy</option>
                <option value="Zomato">Zomato</option>
                <option value="Dine-in">Dine-in</option>
                <option value="Takeaway">Takeaway</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Bill Total (₹)
              </label>
              <input
                type="number"
                value={billTotal}
                onChange={(e) => setBillTotal(e.target.value)}
                placeholder="e.g. 850"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Order Notes / Occasion
            </label>
            <input
              type="text"
              value={receiptNotes}
              onChange={(e) => setReceiptNotes(e.target.value)}
              placeholder="e.g. Dinner with friends, quick lunch delivered"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs text-slate-800 dark:text-slate-100 font-medium"
            />
          </div>

          {/* Dishes List */}
          <div className="space-y-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Dishes Eaten In This Order ({dishes.length})
              </span>
              <button
                type="button"
                onClick={handleAddDish}
                className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Dish</span>
              </button>
            </div>

            {dishes.map((dish, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-sm dark:shadow-neu-dark-sm space-y-3 border border-slate-200/50 dark:border-slate-800/60"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Dish #{idx + 1}
                  </span>
                  {dishes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDish(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition"
                      title="Remove dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      value={dish.name}
                      onChange={(e) => handleDishChange(idx, 'name', e.target.value)}
                      placeholder="Dish name (e.g. Butter Chicken Biryani)"
                      className="w-full px-3 py-2 rounded-xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs text-slate-800 dark:text-slate-100 font-medium"
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      value={dish.price}
                      onChange={(e) => handleDishChange(idx, 'price', e.target.value)}
                      placeholder="Price (₹)"
                      className="w-full px-3 py-2 rounded-xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs text-slate-800 dark:text-slate-100 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Category */}
                  <div>
                    <select
                      value={dish.category}
                      onChange={(e) => handleDishChange(idx, 'category', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs text-slate-800 dark:text-slate-100 font-medium"
                    >
                      <option value="Main Course">Main Course</option>
                      <option value="Appetizer">Appetizer / Starter</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Beverage">Beverage / Drink</option>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Fast Food">Fast Food</option>
                    </select>
                  </div>

                  {/* Verdict */}
                  <div>
                    <select
                      value={dish.verdict}
                      onChange={(e) => handleDishChange(idx, 'verdict', e.target.value as FoodVerdict)}
                      className="w-full px-3 py-2 rounded-xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs text-slate-800 dark:text-slate-100 font-medium"
                    >
                      <option value="Loved It">Loved It (Masterpiece)</option>
                      <option value="Good">Good (Tried &amp; Liked)</option>
                      <option value="Average">Average (Okay)</option>
                      <option value="Never Again">Never Again (Bad/Skip)</option>
                    </select>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-pressed dark:shadow-neu-dark-pressed">
                    <span className="text-[11px] text-slate-400 font-medium">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleDishChange(idx, 'rating', star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              star <= dish.rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Don't Repeat toggle & Notes */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={dish.notes}
                      onChange={(e) => handleDishChange(idx, 'notes', e.target.value)}
                      placeholder="Tasting notes (e.g. Spicy gravy, tender chicken, next time try lasagna)"
                      className="w-full px-3 py-2 rounded-xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs text-slate-800 dark:text-slate-100 font-medium"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-rose-600 dark:text-rose-400 shrink-0">
                    <input
                      type="checkbox"
                      checked={dish.doNotRepeat}
                      onChange={(e) => handleDishChange(idx, 'doNotRepeat', e.target.checked)}
                      className="w-4 h-4 rounded text-rose-500 focus:ring-0"
                    />
                    <span>Don&apos;t Repeat (Try New)</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-neu-sm transition"
            >
              Save Order to Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
