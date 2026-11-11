import React, { useState } from 'react';
import { Star, MapPin, Calendar, ShoppingBag, ChevronDown, ChevronUp, AlertOctagon, Heart, PlusCircle } from 'lucide-react';
import type { Restaurant, FoodEntry, WishlistItem } from '../types/foodLog';

interface RestaurantCardProps {
  restaurant: Restaurant;
  entries: FoodEntry[];
  wishlist: WishlistItem[];
  onAddWishlistItem?: (restaurantName: string) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  entries,
  wishlist,
  onAddWishlistItem,
}) => {
  const [expanded, setExpanded] = useState(true);

  // Collect all unique dishes ordered here
  const allOrderedItems: Array<{
    dish: typeof entries[0]['items'][0];
    date: string;
    source: string;
  }> = [];

  entries.forEach(e => {
    e.items.forEach(item => {
      allOrderedItems.push({
        dish: item,
        date: e.orderDate,
        source: e.orderSource,
      });
    });
  });

  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-flat dark:shadow-neu-dark-flat hover:shadow-neu-flat-hover dark:hover:shadow-neu-dark-hover transition-all duration-300 border border-slate-200/40 dark:border-slate-800/80">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
              {restaurant.name}
            </h3>
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              {restaurant.overallRating.toFixed(1)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            {restaurant.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {restaurant.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Last visit: {restaurant.lastVisited}
            </span>
            <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
              <ShoppingBag className="w-3.5 h-3.5" />
              {restaurant.visitedCount}x Ordered
            </span>
          </div>

          {/* Cuisines */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {restaurant.cuisine.map((c, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-sm-pressed dark:shadow-neu-dark-sm-pressed text-slate-600 dark:text-slate-400"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="self-end sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-sm dark:shadow-neu-dark-sm active:shadow-neu-sm-pressed dark:active:shadow-neu-dark-sm-pressed transition-all"
        >
          <span>{expanded ? 'Collapse' : `View ${allOrderedItems.length} Dishes`}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Content: Eaten Dishes & Wishlist */}
      {expanded && (
        <div className="mt-5 pt-4 border-t border-slate-200/70 dark:border-slate-800/80 space-y-4">
          {/* Eaten Items Section */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Already Eaten &bull; Avoid Repeating ({allOrderedItems.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allOrderedItems.map((entry, idx) => {
                const item = entry.dish;
                const isLoved = item.verdict === 'Loved It';
                const isNeverAgain = item.verdict === 'Never Again';

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-sm dark:shadow-neu-dark-sm border border-slate-200/50 dark:border-slate-800/60 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                              {item.name}
                            </h4>
                            {isLoved && (
                              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                            )}
                            {isNeverAgain && (
                              <AlertOctagon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.category} &bull; Ordered on {entry.date} via {entry.source}
                          </span>
                        </div>

                        {item.price && (
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-[#eef2f7] dark:bg-[#1a1f2b] px-2 py-0.5 rounded-md shadow-neu-sm-pressed dark:shadow-neu-dark-sm-pressed shrink-0">
                            ₹{item.price}
                          </span>
                        )}
                      </div>

                      {/* Tasting Notes */}
                      {item.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-200/40 dark:bg-slate-800/40 p-2 rounded-xl italic">
                          &ldquo;{item.notes}&rdquo;
                        </p>
                      )}

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((t, ti) => (
                            <span
                              key={ti}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Status: Verdict & Don't Repeat Badge */}
                    <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-1">
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
                            Don&apos;t Repeat 🚫
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wishlist / Next Time at this Restaurant */}
          {wishlist.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  Up Next &bull; Dishes To Try Next Time ({wishlist.length})
                </span>
                {onAddWishlistItem && (
                  <button
                    onClick={() => onAddWishlistItem(restaurant.name)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>Add to wishlist</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {wishlist.map((w) => (
                  <div
                    key={w.id}
                    className="px-3 py-2 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40 text-xs flex items-center gap-2"
                  >
                    <span className="font-semibold text-indigo-900 dark:text-indigo-200">
                      {w.itemName}
                    </span>
                    {w.targetPrice && (
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        (₹{w.targetPrice})
                      </span>
                    )}
                    {w.reasonToTry && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        &bull; {w.reasonToTry}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
