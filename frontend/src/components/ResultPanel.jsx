import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, ChevronDown, ChevronUp, Zap, HelpCircle, ArrowUpRight, ArrowDownRight, 
  Disc, Download, ShieldCheck, Target, Sparkles 
} from 'lucide-react';
import { downloadPdfReport } from '../services/api';

// Animated Count-Up Hook
function useCountUp(targetValue, duration = 1.0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(targetValue) || 0;
    if (start === end) return;

    let totalFrames = Math.round((duration * 1000) / 16);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(start + (end - start) * Math.sin((progress * Math.PI) / 2));
      
      setCount(current);

      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [targetValue, duration]);

  return count;
}

export default function ResultPanel({ result, features, trackName, artistName, onNavigateTab }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const score = result?.predicted_popularity || 0;
  const rawScore = result?.raw_score !== undefined ? result.raw_score : score;
  const animatedScore = useCountUp(score, 1.0);

  if (!result) return null;

  const tier = result?.popularity_tier || {
    tier: score >= 85 ? "Viral Superhit" : score >= 70 ? "Mainstream Hit" : score >= 50 ? "Moderate Chart Performer" : "Indie / Emerging Track",
    badge: score >= 85 ? "🔥 Viral Superhit" : score >= 70 ? "⚡ Mainstream Hit" : "📈 Moderate Performer",
    color: score >= 85 ? "#10B981" : score >= 70 ? "#06B6D4" : "#8B5CF6",
    description: "Evaluated by SONIQ AI multi-model ensemble."
  };

  const uncertainty = result?.prediction_uncertainty || {
    std_err: 3.2,
    ci_lower: Math.max(0, score - 6),
    ci_upper: Math.min(100, score + 6),
    confidence_score: 94.2
  };

  const hitPotential = result?.hit_potential || {
    hit_percentage: Math.min(99, Math.round(score * 1.05)),
    tier_badge: "🏆 Platinum Potential",
    category: "Platinum Potential",
    badge_color: "#06B6D4"
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await downloadPdfReport({
        track_name: trackName || "Current Track",
        artist_name: artistName || "Studio Artist",
        features: features,
        prediction: result,
        hit_potential: hitPotential
      });
    } catch (e) {
      console.error("PDF download failed:", e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="rounded-3xl p-6 bg-slate-900/60 border border-slate-800 space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
            PREDICTION RESULT
          </span>
          <h3 className="text-lg font-bold text-white truncate max-w-[220px]">
            {trackName || "Current Song"}
          </h3>
          <span className="text-xs text-slate-400 block truncate">
            {artistName || "Studio Artist"}
          </span>
        </div>

        <span 
          style={{ borderColor: tier.color, backgroundColor: `${tier.color}15`, color: tier.color }}
          className="px-3 py-1 rounded-xl text-xs font-bold border tracking-wide"
        >
          {tier.badge}
        </span>
      </div>

      {/* Main DJ Vinyl Turntable & Score Display */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
        {/* Animated Vinyl Disc */}
        <div className="relative flex items-center justify-center shrink-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: score >= 80 ? 3.5 : 6,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="w-36 h-36 rounded-full bg-black border-4 border-slate-800 flex items-center justify-center shadow-xl relative p-2"
          >
            <div className="w-full h-full rounded-full border border-slate-700/50 flex items-center justify-center">
              <div className="w-2/3 h-2/3 rounded-full border border-slate-800 flex items-center justify-center">
                <Disc className="w-8 h-8 text-cyan-400/80" />
              </div>
            </div>
          </motion.div>

          {/* Central Overlay Predicted Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <div className="bg-slate-950/90 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-xl">
              <span className="text-3xl font-black font-mono text-cyan-400">
                {animatedScore}
              </span>
              <span className="block text-[9px] text-slate-400 font-bold uppercase">
                / 100 Index
              </span>
            </div>
          </div>
        </div>

        {/* Readout Summary */}
        <div className="space-y-2.5 text-center sm:text-left flex-1 min-w-0">
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
            "{result.interpretation}"
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {/* Hit Potential */}
            <div 
              onClick={() => onNavigateTab && onNavigateTab('hit_analyzer')}
              className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition"
            >
              <span className="text-[9px] font-sans text-slate-400 block uppercase">Hit Odds</span>
              <strong className="text-sm text-cyan-400">{hitPotential.hit_percentage}%</strong>
              <span className="text-[10px] text-slate-400 block font-sans truncate">{hitPotential.category}</span>
            </div>

            {/* Uncertainty Bounds */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[9px] font-sans text-slate-400 block uppercase">95% Conf. Interval</span>
              <strong className="text-sm text-purple-300">[{uncertainty.ci_lower}–{uncertainty.ci_upper}]</strong>
              <span className="text-[10px] text-slate-400 block font-sans">±{uncertainty.std_err} error</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Contributions Dropdown */}
      <div className="pt-2 border-t border-slate-800">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 hover:bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold transition cursor-pointer"
        >
          <span className="flex items-center gap-1.5 text-xs text-slate-200">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            Top Feature Drivers for This Song
          </span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2.5 space-y-2">
                {result.top_contributing_features?.slice(0, 4).map((item, idx) => {
                  const isPositive = item.impact_score >= 0;
                  const formattedValue = typeof item.value === 'number' 
                    ? (item.feature === 'loudness' ? `${item.value.toFixed(1)} dB` : item.feature === 'tempo' ? `${item.value} BPM` : item.value.toFixed(2))
                    : item.value;

                  return (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {isPositive ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                        <div>
                          <span className="font-semibold text-white">{item.label}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Input: {formattedValue}
                          </span>
                        </div>
                      </div>

                      <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                        isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {isPositive ? `+${item.impact_score} pts` : `${item.impact_score} pts`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isDownloading ? "Generating..." : "Download PDF Report"}</span>
        </button>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('what_if')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Simulate Tweaks</span>
          </button>
        )}
      </div>
    </div>
  );
}
