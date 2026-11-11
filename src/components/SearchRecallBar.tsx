import React, { useState, useMemo } from 'react';
import { Search, X, AlertCircle, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import type { FoodLogData } from '../types/foodLog';

interface SearchRecallBarProps {
  data: FoodLogData;
  onSelectRestaurant?: (restaurantName: string) => void;
}

export const SearchRecallBar: React.FC<SearchRecallBarProps> = ({ data, onSelectRestaurant }) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    // Matching restaurants
    const matchedRestaurants = data.restaurants.filter(r =>
      r.name.toLowerCase().includes(q) ||
      (r.location && r.location.toLowerCase().includes(q)) ||
      r.cuisine.some(c => c.toLowerCase().includes(q))
    );

    // Matching dishes across entries
    const matchedDishes: Array<{
      restaurantName: string;
      orderDate: string;
      orderSource: string;
      dish: typeof data.entries[0]['items'][0];
    }> = [];

    data.entries.forEach(entry => {
      entry.items.forEach(item => {
        if (
          item.name.toLowerCase().includes(q) ||
          (item.tags && item.tags.some(t => t.toLowerCase().includes(q))) ||
          (item.notes && item.notes.toLowerCase().includes(q))
        ) {
          matchedDishes.push({
            restaurantName: entry.restaurantName,
            orderDate: entry.orderDate,
            orderSource: entry.orderSource,
            dish: item,
          });
        }
      });
    });

    // Matching wishlist items
    const matchedWishlist = data.wishlist.filter(w =>
      w.restaurantName.toLowerCase().includes(q) ||
      w.itemName.toLowerCase().includes(q)
    );

    return {
      restaurants: matchedRestaurants,
      dishes: matchedDishes,
      wishlist: matchedWishlist,
    };
  }, [query, data]);

  const hasResults =
    searchResults &&
    (searchResults.restaurants.length > 0 ||
      searchResults.dishes.length > 0 ||
      searchResults.wishlist.length > 0);

  return (
    <div className="relative w-full my-4">
      {/* Neumorphic Input Wrapper */}
      <div className="relative flex items-center w-full rounded-2xl bg-[#eef2f7] dark:bg-[#1a1f2b] shadow-neu-pressed dark:shadow-neu-dark-pressed px-4 py-3 sm:py-3.5 transition-all">
        <Search className="w-5 h-5 text-amber-500 mr-3 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Check before ordering: type restaurant or dish (e.g. Joey's Pizza, Biryani, Truffles)..."
          className="w-full bg-transparent border-none outline-none text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 rounded-full hover:bg-slate-300/40 dark:hover:bg-slate-700/40 text-slate-400 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Instant Recall Dropdown Surface */}
      {query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 p-4 sm:p-5 rounded-2xl bg-[#eef2f7] dark:bg-[#1c212d] shadow-neu-flat dark:shadow-neu-dark-flat z-40 max-h-[80vh] overflow-y-auto border border-slate-200/60 dark:border-slate-800">
          {!hasResults ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-pressed dark:shadow-neu-dark-pressed text-slate-400 mb-3">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                No previous logs found for &ldquo;{query}&rdquo;
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Green light! You haven&apos;t logged any orders for this yet, so everything is brand new to try.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Restaurant Matches */}
              {searchResults.restaurants.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Restaurant Match &bull; Don&apos;t Repeat Past Dishes</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.restaurants.map((rest) => {
                      // Grab all dishes ordered from this restaurant
                      const prevItems: typeof data.entries[0]['items'] = [];
                      data.entries
                        .filter(e => e.restaurantName.toLowerCase() === rest.name.toLowerCase())
                        .forEach(e => prevItems.push(...e.items));

                      const wishlistForRest = data.wishlist.filter(
                        w => w.restaurantName.toLowerCase() === rest.name.toLowerCase()
                      );

                      return (
                        <div
                          key={rest.id}
                          className="p-3.5 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-sm dark:shadow-neu-dark-sm border border-slate-200/40 dark:border-slate-800/60"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                                {rest.name}
                                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                  {rest.visitedCount}x ordered
                                </span>
                              </h5>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {rest.location || rest.cuisine.join(', ')}
                              </p>
                            </div>
                            {onSelectRestaurant && (
                              <button
                                onClick={() => {
                                  onSelectRestaurant(rest.name);
                                  setQuery('');
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-500 transition"
                                title="View in restaurant list"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {/* Already eaten list */}
                          <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-800">
                            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wide flex items-center gap-1">
                              <span>⚠️ Already Eaten (Try Something Else):</span>
                            </span>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              {prevItems.map((item, idx) => (
                                <span
                                  key={idx}
                                  className={`text-xs px-2 py-1 rounded-lg font-medium shadow-neu-sm-pressed dark:shadow-neu-dark-sm-pressed ${
                                    item.verdict === 'Never Again'
                                      ? 'text-red-600 dark:text-red-400 bg-red-500/10'
                                      : item.verdict === 'Loved It'
                                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10'
                                      : 'text-slate-700 dark:text-slate-300 bg-slate-200/50 dark:bg-slate-800'
                                  }`}
                                  title={item.notes}
                                >
                                  {item.name} &bull; {item.verdict}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Next to try suggestions */}
                          {wishlistForRest.length > 0 && (
                            <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Try Next:</span>
                              </span>
                              <div className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">
                                {wishlistForRest.map(w => w.itemName).join(', ')}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Specific Dish Matches */}
              {searchResults.dishes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Dishes You&apos;ve Already Tried</span>
                  </div>
                  <div className="space-y-2">
                    {searchResults.dishes.map((match, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-sm dark:shadow-neu-dark-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                              {match.dish.name}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                match.dish.verdict === 'Loved It'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : match.dish.verdict === 'Never Again'
                                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              }`}
                            >
                              {match.dish.verdict}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            At <span className="font-semibold text-slate-700 dark:text-slate-300">{match.restaurantName}</span> &bull; {match.orderDate} ({match.orderSource})
                          </p>
                          {match.dish.notes && (
                            <p className="text-xs italic text-slate-600 dark:text-slate-400 mt-1">
                              &ldquo;{match.dish.notes}&rdquo;
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {match.dish.price && (
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              ₹{match.dish.price}
                            </span>
                          )}
                          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold shadow-neu-sm-pressed dark:shadow-neu-dark-sm-pressed">
                            Already Eaten ⚠️
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
