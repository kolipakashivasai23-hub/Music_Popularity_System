import React from 'react';
import { Sparkles, Music } from 'lucide-react';

export default function Header() {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Song Popularity Studio
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
            XGBoost ML (R² 0.91)
          </span>
        </div>
        <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
          Predict popularity from 0–100, inspect feature impacts, estimate confidence bounds, and preview audio resonance for the selected track.
        </p>
      </div>

      <div className="flex items-center gap-1.5 h-10 px-4 py-2 bg-slate-950 rounded-xl border border-slate-800">
        {[30, 65, 45, 80, 50, 75, 40, 90, 60, 45, 70, 55].map((h, i) => (
          <div
            key={i}
            className="w-1 rounded-full bg-cyan-400/80"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}
