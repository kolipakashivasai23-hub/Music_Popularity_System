import React, { useState, useEffect } from 'react';
import { 
  Sliders, Sparkles, RefreshCw, Check, Music, Zap, Volume2, Clock, 
  Radio, Headphones, Mic, Smile 
} from 'lucide-react';
import { simulateWhatIf } from '../services/api';

const SIM_SLIDERS = [
  { key: 'danceability', label: 'Danceability', min: 0.0, max: 1.0, step: 0.01, unit: '', icon: Music },
  { key: 'energy', label: 'Energy', min: 0.0, max: 1.0, step: 0.01, unit: '', icon: Zap },
  { key: 'loudness', label: 'Loudness', min: -30.0, max: 0.0, step: 0.5, unit: ' dB', icon: Volume2 },
  { key: 'tempo', label: 'Tempo', min: 50.0, max: 220.0, step: 1.0, unit: ' BPM', icon: Clock },
  { key: 'valence', label: 'Valence (Mood)', min: 0.0, max: 1.0, step: 0.01, unit: '', icon: Smile },
  { key: 'acousticness', label: 'Acousticness', min: 0.0, max: 1.0, step: 0.01, unit: '', icon: Radio },
  { key: 'instrumentalness', label: 'Instrumentalness', min: 0.0, max: 1.0, step: 0.01, unit: '', icon: Headphones },
  { key: 'speechiness', label: 'Speechiness', min: 0.0, max: 1.0, step: 0.01, unit: '', icon: Mic },
];

export default function WhatIfSimulator({ baselineFeatures, trackName, artistName, onApplyModified }) {
  const [modified, setModified] = useState({ ...baselineFeatures });
  const [simResult, setSimResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    setModified({ ...baselineFeatures });
    const runSim = async () => {
      setIsSimulating(true);
      try {
        const res = await simulateWhatIf(baselineFeatures, baselineFeatures);
        setSimResult(res);
      } catch (e) {
        console.error("Simulation error:", e);
      } finally {
        setIsSimulating(false);
      }
    };
    runSim();
  }, [baselineFeatures]);

  const handleSliderChange = (key, value) => {
    const updated = { ...modified, [key]: parseFloat(value) };
    setModified(updated);
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await simulateWhatIf(baselineFeatures, modified);
      setSimResult(res);
    } catch (e) {
      console.error("Simulation error:", e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetToBaseline = () => {
    setModified({ ...baselineFeatures });
    simulateWhatIf(baselineFeatures, baselineFeatures).then(res => setSimResult(res));
  };

  const deltaScore = simResult?.delta?.score_diff || 0;
  const deltaHit = simResult?.delta?.hit_prob_diff || 0;
  const isBetter = deltaScore >= 0;

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/60 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Interactive What-If Simulator</h2>
            <p className="text-xs text-slate-400">
              Modifying features for <strong className="text-purple-300">{trackName || "Current Song"}</strong> {artistName ? `(${artistName})` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToBaseline}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Original</span>
          </button>
          <button
            onClick={() => onApplyModified && onApplyModified(modified)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Tweaks</span>
          </button>
        </div>
      </div>

      {/* Comparison Delta Highlights */}
      {simResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Baseline */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Original Track Score</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold font-mono text-white">
                {simResult.baseline?.predicted_popularity || 0}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <span className="text-xs text-slate-400 block mt-0.5">
              Hit Odds: {simResult.baseline?.hit_potential?.hit_percentage || 0}%
            </span>
          </div>

          {/* Delta */}
          <div className={`p-4 rounded-xl border ${
            isBetter ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wide block">Net Change</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold font-mono">
                {deltaScore > 0 ? `+${deltaScore}` : deltaScore}
              </span>
              <span className="text-xs font-semibold">pts popularity</span>
            </div>
            <span className="text-xs block mt-0.5">
              Hit Odds: {deltaHit > 0 ? `+${deltaHit}%` : `${deltaHit}%`}
            </span>
          </div>

          {/* Modified */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/30">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide block">Simulated Score</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold font-mono text-cyan-300">
                {simResult.modified?.predicted_popularity || 0}
              </span>
              <span className="text-xs text-cyan-400">/ 100</span>
            </div>
            <span className="text-xs text-cyan-300 block mt-0.5">
              Hit Odds: {simResult.modified?.hit_potential?.hit_percentage || 0}%
            </span>
          </div>
        </div>
      )}

      {/* Sliders & Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sliders Column */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {SIM_SLIDERS.map((slider) => {
            const currentVal = modified[slider.key] !== undefined ? modified[slider.key] : slider.min;
            const baseVal = baselineFeatures[slider.key] !== undefined ? baselineFeatures[slider.key] : slider.min;
            const isChanged = currentVal !== baseVal;

            return (
              <div key={slider.key} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{slider.label}</span>
                  <div className="flex items-center gap-1.5">
                    {isChanged && (
                      <span className="text-[10px] font-mono text-slate-400">
                        ({baseVal}{slider.unit})
                      </span>
                    )}
                    <span className="font-mono font-bold text-cyan-400">
                      {currentVal}{slider.unit}
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={currentVal}
                  onChange={(e) => handleSliderChange(slider.key, e.target.value)}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            );
          })}
        </div>

        {/* Action & Feedback */}
        <div className="lg:col-span-4 space-y-4">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? "Recalculating..." : "Recalculate Model"}</span>
          </button>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 block">AI Production Suggestions</span>
            <div className="space-y-2 text-xs text-slate-400">
              {simResult?.tips?.map((tip, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 leading-relaxed">
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
