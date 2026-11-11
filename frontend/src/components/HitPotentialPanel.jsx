import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowUpRight, ArrowDownRight, Sparkles, Zap, Disc } from 'lucide-react';
import { analyzeHitPotential } from '../services/api';

export default function HitPotentialPanel({ features, trackName, artistName, onNavigateTab }) {
  const [hitData, setHitData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHitPotential = async () => {
      setIsLoading(true);
      try {
        const data = await analyzeHitPotential(features);
        setHitData(data);
      } catch (e) {
        console.error("Hit potential analysis failed:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHitPotential();
  }, [features]);

  const pct = hitData?.hit_percentage || 50;

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/60 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Hit Potential Analyzer</h2>
              <p className="text-xs text-slate-400">
                Evaluation for <strong className="text-cyan-300">{trackName || "Selected Song"}</strong> {artistName ? `by ${artistName}` : ''}
              </p>
            </div>
          </div>
        </div>

        {hitData && (
          <span 
            style={{ borderColor: hitData.badge_color, backgroundColor: `${hitData.badge_color}15`, color: hitData.badge_color }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold border tracking-wide"
          >
            {hitData.tier_badge}
          </span>
        )}
      </div>

      {/* Main Probability Meter & Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Probability Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col items-center text-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Arc Gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#1E293B"
                strokeWidth="9"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="9"
                strokeDasharray={`${(pct / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black font-mono text-cyan-400">
                {pct}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
                Hit Probability
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-base font-bold text-white">{hitData?.category || "Processing..."}</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Estimated by the Random Forest Classifier based on rhythmic and acoustic structure
            </p>
          </div>
        </div>

        {/* Factors Breakdown */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Acoustic Factors for "{trackName || "This Song"}":
          </span>

          <div className="space-y-2.5">
            {hitData?.factors?.length > 0 ? (
              hitData.factors.map((item, idx) => {
                const isBoost = item.effect === "boost";
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-3"
                  >
                    <div className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
                      isBoost ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {isBoost ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.factor}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                          isBoost ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {isBoost ? "Positive Driver" : "Constraining Factor"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-400 text-xs">
                Evaluating acoustic parameters for this track...
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigateTab && onNavigateTab('what_if')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Simulate Tweaking This Song</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
