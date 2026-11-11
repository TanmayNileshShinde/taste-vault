import React from 'react';
import { Utensils, Moon, Sun, Plus, Download, Sparkles } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onOpenAddModal: () => void;
  onExportData: () => void;
  totalPlaces: number;
  totalDishes: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  toggleDarkMode,
  onOpenAddModal,
  onExportData,
  totalPlaces,
  totalDishes,
}) => {
  return (
    <header className="sticky top-0 z-30 px-4 sm:px-8 py-4 bg-[#eef2f7]/90 dark:bg-[#151821]/90 backdrop-blur-md transition-colors border-b border-slate-200/50 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#eef2f7] dark:bg-[#1c212d] shadow-neu-flat dark:shadow-neu-dark-flat text-amber-500">
              <Utensils className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-sans">
                  Taste<span className="text-amber-500">Vault</span>
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Don&apos;t Repeat
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personal Eatery Ledger &bull; Explore new flavors every time
              </p>
            </div>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="p-2.5 rounded-xl bg-[#eef2f7] dark:bg-[#1c212d] shadow-neu-sm dark:shadow-neu-dark-sm active:shadow-neu-sm-pressed dark:active:shadow-neu-dark-sm-pressed text-slate-600 dark:text-slate-300 transition-all"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenAddModal}
              aria-label="Add entry"
              className="p-2.5 rounded-xl bg-amber-500 text-white shadow-neu-sm dark:shadow-neu-dark-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Tickers & Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#eef2f7] dark:bg-[#1c212d] shadow-neu-pressed dark:shadow-neu-dark-pressed text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {totalPlaces} Spots Visited
            </span>
            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">
              {totalDishes} Dishes Logged
            </span>
          </div>

          {/* Export JSON Button */}
          <button
            onClick={onExportData}
            title="Download latest food-log.json"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-[#eef2f7] dark:bg-[#1c212d] shadow-neu-sm dark:shadow-neu-dark-sm hover:shadow-neu-flat dark:hover:shadow-neu-dark-flat active:shadow-neu-sm-pressed dark:active:shadow-neu-dark-sm-pressed transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export Data</span>
          </button>

          {/* Theme switch */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
            className="p-2.5 rounded-xl bg-[#eef2f7] dark:bg-[#1c212d] shadow-neu-sm dark:shadow-neu-dark-sm hover:shadow-neu-flat dark:hover:shadow-neu-dark-flat active:shadow-neu-sm-pressed dark:active:shadow-neu-dark-sm-pressed text-slate-600 dark:text-slate-300 transition-all"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Add Order Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-neu-sm dark:shadow-neu-dark-sm active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log Bill / Dish</span>
          </button>
        </div>
      </div>
    </header>
  );
};
