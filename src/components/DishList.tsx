import React, { useState, useMemo } from 'react';
import { Star, Filter, Heart, AlertOctagon, Utensils, Tag } from 'lucide-react';
import type { FoodLogData } from '../types/foodLog';

interface DishListProps {
  data: FoodLogData;
}

export const DishList: React.FC<DishListProps> = ({ data }) => {
  const [selectedVerdict, setSelectedVerdict] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');

  // Collect all dishes flattened
  const allDishes = useMemo(() => {
    const list: Array<{
      restaurantName: string;
      orderDate: string;
      orderSource: string;
      item: typeof data.entries[0]['items'][0];
    }> = [];

    data.entries.forEach(entry => {
      entry.items.forEach(dish => {
        list.push({
          restaurantName: entry.restaurantName,
          orderDate: entry.orderDate,
          orderSource: entry.orderSource,
          item: dish,
        });
      });
    });

    return list.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [data]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    allDishes.forEach(d => {
      if (d.item.category) set.add(d.item.category);
    });
    return ['All', ...Array.from(set)];
  }, [allDishes]);

  const filteredDishes = useMemo(() => {
    return allDishes.filter(d => {
      if (selectedVerdict !== 'All' && d.item.verdict !== selectedVerdict) return false;
      if (selectedCategory !== 'All' && d.item.category !== selectedCategory) return false;
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        const matchName = d.item.name.toLowerCase().includes(q);
        const matchRest = d.restaurantName.toLowerCase().includes(q);
        const matchNotes = d.item.notes?.toLowerCase().includes(q);
        const matchTag = d.item.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchRest && !matchNotes && !matchTag) return false;
      }
      return true;
    });
  }, [allDishes, selectedVerdict, selectedCategory, searchFilter]);

  return (
    <div className="space-y-5">
      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-sm dark:shadow-neu-dark-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter dishes by name, tag, or note..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-pressed dark:shadow-neu-dark-pressed outline-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Category & Verdict Dropdowns / Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl font-medium bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-sm dark:shadow-neu-dark-sm outline-none text-slate-700 dark:text-slate-300"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          {/* Verdict Pills */}
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 ml-1">
            <Filter className="w-3.5 h-3.5" />
          </span>
          {['All', 'Loved It', 'Good', 'Average', 'Never Again'].map((v) => {
            const active = selectedVerdict === v;
            return (
              <button
                key={v}
                onClick={() => setSelectedVerdict(v)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  active
                    ? 'bg-amber-500 text-white shadow-neu-sm'
                    : 'bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-sm dark:shadow-neu-dark-sm active:shadow-neu-sm-pressed dark:active:shadow-neu-dark-sm-pressed text-slate-600 dark:text-slate-300'
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDishes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Utensils className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              No dishes match your filter
            </p>
          </div>
        ) : (
          filteredDishes.map((entry, idx) => {
            const item = entry.item;
            const isLoved = item.verdict === 'Loved It';
            const isNeverAgain = item.verdict === 'Never Again';

            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-sm dark:shadow-neu-dark-sm hover:shadow-neu-flat dark:hover:shadow-neu-dark-flat transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                          {item.name}
                        </h4>
                        {isLoved && <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />}
                        {isNeverAgain && <AlertOctagon className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                      </div>
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                        {entry.restaurantName}
                      </span>
                    </div>

                    {item.price && (
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-lg bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-sm-pressed dark:shadow-neu-dark-sm-pressed">
                        ₹{item.price}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1">
                    {item.category} &bull; {entry.orderDate} ({entry.orderSource})
                  </p>

                  {item.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 p-2 rounded-xl bg-slate-200/40 dark:bg-slate-800/40 italic">
                      &ldquo;{item.notes}&rdquo;
                    </p>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {item.tags.map((t, ti) => (
                        <span
                          key={ti}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= item.rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isLoved
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : isNeverAgain
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {item.verdict}
                    </span>

                    {item.doNotRepeat && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Don&apos;t Repeat
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
