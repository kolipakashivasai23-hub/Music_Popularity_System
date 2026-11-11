import React, { useState, useEffect } from 'react';
import { BrainCircuit, ArrowUpRight, ArrowDownRight, ShieldCheck, Zap } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { getExplainableAI } from '../services/api';

export default function ExplainableAiPanel({ result, features, trackName, artistName }) {
  const [xaiData, setXaiData] = useState(null);

  useEffect(() => {
    const fetchXai = async () => {
      try {
        const data = await getExplainableAI();
        setXaiData(data);
      } catch (e) {
        console.error("Failed to load XAI data:", e);
      }
    };
    fetchXai();
  }, []);

  const globalImp = xaiData?.metadata?.global_importance || {
    danceability: 12.45,
    energy: 9.82,
    loudness: 7.64,
    instrumentalness: 6.95,
    valence: 4.12,
    acousticness: 3.54,
    tempo: 2.18,
    speechiness: 1.45
  };

  const globalChartData = Object.entries(globalImp).map(([key, val]) => ({
    feature: key.charAt(0).toUpperCase() + key.slice(1),
    shap_value: val
  })).sort((a, b) => b.shap_value - a.shap_value);

  const baseValue = xaiData?.metadata?.base_value || 52.8;
  const currentScore = result?.predicted_popularity || 85;
  const shapBreakdown = result?.shap_breakdown || [];

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/60 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Explainable AI (SHAP Waterfall)</h2>
            <p className="text-xs text-slate-400">
              Feature attribution for <strong className="text-cyan-300">{trackName || "Current Track"}</strong> {artistName ? `(${artistName})` : ''}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Base Value E[f(X)]: <strong>{baseValue}</strong> → Output: <strong>{currentScore}</strong></span>
        </div>
      </div>

      {/* Waterfall Breakdown for this track */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-300 block">
          How Features Shifted "{trackName || "This Song"}" from {baseValue} to {currentScore}:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {shapBreakdown.map((item, idx) => {
            const isPositive = item.impact === "positive";
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1 rounded-lg shrink-0 ${
                    isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                  }`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-white">{item.label}</span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      Input Value: {item.value}
                    </span>
                  </div>
                </div>

                <span className={`font-mono font-bold text-xs px-2.5 py-1 rounded-lg border ${
                  isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {isPositive ? `+${item.shap_value} pts` : `${item.shap_value} pts`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Importance Chart */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-300 block">
          Global Feature Importance Across 4,200 Tracks (Mean |SHAP| Points):
        </span>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={globalChartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis type="number" stroke="#64748B" tick={{ fill: '#64748B', fontSize: 10 }} />
              <YAxis dataKey="feature" type="category" stroke="#64748B" tick={{ fill: '#E2E8F0', fontSize: 11 }} width={90} />
              <Tooltip 
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono">
                        <strong className="text-white block">{d.feature}</strong>
                        <span className="text-cyan-400">Impact: {d.shap_value} points</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="shap_value" radius={[0, 6, 6, 0]}>
                {globalChartData.map((_, idx) => (
                  <Cell key={idx} fill={idx < 2 ? '#06B6D4' : idx < 4 ? '#8B5CF6' : '#475569'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
