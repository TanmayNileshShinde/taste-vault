import React from 'react';
import { Camera } from 'lucide-react';

export const ScreenshotDropHelper: React.FC = () => {
  return (
    <div className="my-6 p-5 sm:p-6 rounded-3xl bg-[#eef2f7] dark:bg-[#1b202c] shadow-neu-flat dark:shadow-neu-dark-flat border border-amber-500/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-pressed dark:shadow-neu-dark-pressed text-amber-500 shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                How Your Screenshot Sync Works
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                100% Automated
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Whenever you eat something or order food, just snap a picture of the bill or send the Swiggy/Zomato order screenshot directly to me in Antigravity chat.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Step Workflow */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
        <div className="p-3 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-sm-pressed dark:shadow-neu-dark-sm-pressed flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-full flex items-center justify-center bg-amber-500 text-white text-[11px] font-bold shrink-0">
            1
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Send Bill / Menu Card SS
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Drop screenshot in chat &amp; mention any specific ratings/notes.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-sm-pressed dark:shadow-neu-dark-sm-pressed flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-full flex items-center justify-center bg-amber-500 text-white text-[11px] font-bold shrink-0">
            2
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
              AI Extracts Items &amp; Prices
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              I update <code className="text-amber-600 dark:text-amber-400 font-mono">data/food-log.json</code> with new dishes &amp; ratings.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#eef2f7] dark:bg-[#161a24] shadow-neu-sm-pressed dark:shadow-neu-dark-sm-pressed flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-full flex items-center justify-center bg-emerald-500 text-white text-[11px] font-bold shrink-0">
            3
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Auto-Pushed to Tanmay&apos;s GitHub
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Live website updates instantly so you never repeat dishes!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
