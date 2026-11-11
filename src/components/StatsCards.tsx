import React from 'react';
import { Store, UtensilsCrossed, AlertTriangle, ShieldCheck, Heart } from 'lucide-react';
import type { FoodLogData } from '../types/foodLog';

interface StatsCardsProps {
  data: FoodLogData;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  const totalRestaurants = data.restaurants.length;
  
  let totalDishes = 0;
  let repeatsAvoided = 0;
  let neverAgainCount = 0;
  let lovedItCount = 0;

  data.entries.forEach(entry => {
    entry.items.forEach(item => {
      totalDishes++;
      if (item.doNotRepeat) repeatsAvoided++;
      if (item.verdict === 'Never Again') neverAgainCount++;
      if (item.verdict === 'Loved It') lovedItCount++;
    });
  });

  const cards = [
    {
      title: 'Eateries Visited',
      value: totalRestaurants,
      subtext: 'Across Mumbai & Online',
      icon: Store,
      accent: 'text-blue-500 dark:text-blue-400',
      pillBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Dishes Logged',
      value: totalDishes,
      subtext: 'Catalogued with taste notes',
      icon: UtensilsCrossed,
      accent: 'text-amber-500 dark:text-amber-400',
      pillBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Repeats Prevented',
      value: repeatsAvoided,
      subtext: 'Prompting you to try new items',
      icon: ShieldCheck,
      accent: 'text-emerald-500 dark:text-emerald-400',
      pillBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Loved It / Hall of Fame',
      value: lovedItCount,
      subtext: 'Top rated signature orders',
      icon: Heart,
      accent: 'text-rose-500 dark:text-rose-400',
      pillBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    },
    {
      title: 'Never Again Warned',
      value: neverAgainCount,
      subtext: 'Saved from bad repeats',
      icon: AlertTriangle,
      accent: 'text-red-500 dark:text-red-400',
      pillBg: 'bg-red-500/10 text-red-600 dark:text-red-400',
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 my-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-sm dark:shadow-neu-dark-sm hover:shadow-neu-flat dark:hover:shadow-neu-dark-flat transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-pressed dark:shadow-neu-dark-pressed ${card.accent}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
};
