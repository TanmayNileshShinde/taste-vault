import React from 'react';
import { ShieldAlert } from 'lucide-react';
import type { FoodLogData } from '../types/foodLog';

interface NeverAgainListProps {
  data: FoodLogData;
}

export const NeverAgainList: React.FC<NeverAgainListProps> = ({ data }) => {
  const badItems: Array<{
    restaurantName: string;
    orderDate: string;
    dish: typeof data.entries[0]['items'][0];
  }> = [];

  data.entries.forEach(e => {
    e.items.forEach(item => {
      if (item.verdict === 'Never Again' || item.rating <= 2) {
        badItems.push({
          restaurantName: e.restaurantName,
          orderDate: e.orderDate,
          dish: item,
        });
      }
    });
  });

  return (
    <div className="space-y-4">
      <div className="p-4 sm:p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-red-700 dark:text-red-300">
            Blacklisted Dishes &bull; Absolute Zero-Repeat List
          </h3>
          <p className="text-xs text-red-600/80 dark:text-red-400/80">
            These dishes were oily, bland, or failed to deliver. Skip these without thinking twice!
          </p>
        </div>
      </div>

      {badItems.length === 0 ? (
        <div className="text-center py-12 p-8 rounded-2xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-sm dark:shadow-neu-dark-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No dishes currently blacklisted. You&apos;ve had great luck with your food so far!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badItems.map((entry, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-sm dark:shadow-neu-dark-sm border-l-4 border-l-red-500 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-1.5">
                      {entry.dish.name}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                        🚫 Blacklist
                      </span>
                    </h4>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      From {entry.restaurantName} &bull; Ordered on {entry.orderDate}
                    </span>
                  </div>
                  {entry.dish.price && (
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      ₹{entry.dish.price}
                    </span>
                  )}
                </div>

                {entry.dish.notes && (
                  <p className="text-xs text-red-700 dark:text-red-300/90 mt-3 p-2.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40">
                    &ldquo;{entry.dish.notes}&rdquo;
                  </p>
                )}
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Rating: {entry.dish.rating} / 5</span>
                <span className="font-bold text-red-500">Do Not Re-order</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
