import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Grid, ScatterChart as ScatterIcon, AlertTriangle, 
  Layers, Info, ArrowUpRight, ArrowDownRight, Compass 
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { getStatisticalLab } from '../services/api';

const FEATURE_LIST = [
  'danceability', 'energy', 'loudness', 'tempo',
  'acousticness', 'instrumentalness', 'speechiness', 'valence', 'popularity'
];

export default function StatisticalLabPanel() {
  const [activeSubTab, setActiveSubTab] = useState('heatmap'); // 'heatmap', 'scatter', 'outliers', 'distributions'
  const [statsData, setStatsData] = useState(null);
  const [corrType, setCorrType] = useState('pearson'); // 'pearson', 'spearman'
  const [selectedScatterKey, setSelectedScatterKey] = useState('danceability_vs_popularity');
  const [selectedDistFeature, setSelectedDistFeature] = useState('danceability');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStatisticalLab();
        setStatsData(data);
      } catch (e) {
        console.error("Failed to load statistical lab data:", e);
      }
    };
    fetchStats();
  }, []);

  const matrix = corrType === 'pearson' ? statsData?.pearson_matrix : statsData?.spearman_matrix;

  // Color helper for correlation heatmap (-1.0 to +1.0)
  const getCorrColor = (val) => {
    if (val === undefined || isNaN(val)) return 'rgba(255, 255, 255, 0.05)';
    if (val > 0) {
      const alpha = Math.min(0.9, Math.abs(val) * 0.95);
      return `rgba(6, 182, 212, ${alpha})`; // cyan
    } else {
      const alpha = Math.min(0.9, Math.abs(val) * 0.95);
      return `rgba(244, 63, 94, ${alpha})`; // rose
    }
  };

  const currentRegression = statsData?.regressions?.[selectedScatterKey];
  const currentDist = statsData?.distributions?.[selectedDistFeature];
  const outliers = statsData?.outliers || {};

  return (
    <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Statistical Laboratory</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                Parametric & Monotonic Metrics
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pearson & Spearman matrices, OLS regressions, IQR outlier thresholds, and distribution parameters
            </p>
          </div>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto max-w-full">
          {[
            { id: 'heatmap', label: 'Correlation Heatmap', icon: Grid },
            { id: 'scatter', label: 'Regression Scatter', icon: TrendingUp },
            { id: 'outliers', label: 'Outlier Detection', icon: AlertTriangle },
            { id: 'distributions', label: 'Distributions', icon: Layers }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: CORRELATION HEATMAP */}
      {activeSubTab === 'heatmap' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>
                {corrType === 'pearson' ? 'Pearson (r) measures linear association' : 'Spearman (ρ) measures monotonic rank association'}
              </span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setCorrType('pearson')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  corrType === 'pearson' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pearson (r)
              </button>
              <button
                onClick={() => setCorrType('spearman')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  corrType === 'spearman' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Spearman (ρ)
              </button>
            </div>
          </div>

          {/* Interactive Heatmap Matrix Grid */}
          <div className="overflow-x-auto p-4 rounded-xl bg-slate-950 border border-slate-800">
            <table className="w-full border-collapse text-[11px] font-mono">
              <thead>
                <tr>
                  <th className="p-2 text-left text-slate-400 font-bold border-b border-slate-800">Feature</th>
                  {FEATURE_LIST.map(f => (
                    <th key={f} className="p-2 text-center text-slate-400 font-bold border-b border-slate-800 capitalize truncate max-w-[80px]">
                      {f.slice(0, 6)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_LIST.map(rowFeat => (
                  <tr key={rowFeat} className="hover:bg-slate-800/20 transition">
                    <td className="p-2 font-bold text-slate-300 capitalize border-b border-slate-800/40">
                      {rowFeat}
                    </td>
                    {FEATURE_LIST.map(colFeat => {
                      const val = matrix?.[rowFeat]?.[colFeat];
                      const isSelf = rowFeat === colFeat;
                      const formattedVal = val !== undefined ? (val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)) : '-';

                      return (
                        <td
                          key={colFeat}
                          title={`${rowFeat} vs ${colFeat}: ${val}`}
                          style={{ backgroundColor: isSelf ? 'rgba(255, 255, 255, 0.04)' : getCorrColor(val) }}
                          className="p-2 text-center font-bold text-white border border-slate-900 rounded transition cursor-pointer"
                        >
                          {formattedVal}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Heatmap Legend */}
            <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800 px-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500 inline-block" /> Strong Negative (-1.0)
              </span>
              <span>0.0 Neutral</span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-400 inline-block" /> Strong Positive (+1.0)
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* SUB-TAB 2: REGRESSION SCATTER PLOTS */}
      {activeSubTab === 'scatter' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-400">Select Relationship:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'danceability_vs_popularity', label: 'Danceability vs Popularity' },
                { key: 'energy_vs_popularity', label: 'Energy vs Popularity' },
                { key: 'loudness_vs_popularity', label: 'Loudness vs Popularity' },
                { key: 'valence_vs_popularity', label: 'Valence vs Popularity' },
                { key: 'energy_vs_loudness', label: 'Energy vs Loudness' }
              ].map(rel => (
                <button
                  key={rel.key}
                  onClick={() => setSelectedScatterKey(rel.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    selectedScatterKey === rel.key
                      ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {rel.label}
                </button>
              ))}
            </div>
          </div>

          {currentRegression && (
            <div className="space-y-4">
              {/* OLS Formula Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Formula</span>
                  <span className="text-sm font-bold text-cyan-400">
                    y = {currentRegression.slope}x {currentRegression.intercept >= 0 ? `+ ${currentRegression.intercept}` : currentRegression.intercept}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">R² Variance</span>
                  <span className="text-sm font-bold text-white">
                    {(currentRegression.r_squared * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">p-Value</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {currentRegression.p_value}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Standard Error</span>
                  <span className="text-sm font-bold text-purple-300">
                    ±{currentRegression.std_error}
                  </span>
                </div>
              </div>

              {/* Scatter Plot via Recharts */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 15, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis 
                      type="number" 
                      dataKey={currentRegression.x_feature} 
                      name={currentRegression.x_feature}
                      stroke="#64748B"
                      tick={{ fill: '#64748B', fontSize: 11 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey={currentRegression.y_feature} 
                      name={currentRegression.y_feature}
                      stroke="#64748B"
                      tick={{ fill: '#64748B', fontSize: 11 }}
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          const pt = payload[0].payload;
                          return (
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs shadow-xl">
                              <span className="font-bold text-white block">{pt.track_name}</span>
                              <span className="text-[11px] text-slate-400 block">{pt.artist_name} • {pt.genre}</span>
                              <div className="mt-1 pt-1 border-t border-slate-800 font-mono text-cyan-400">
                                {currentRegression.x_feature}: {pt[currentRegression.x_feature]} | {currentRegression.y_feature}: {pt[currentRegression.y_feature]}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter 
                      name="Tracks" 
                      data={currentRegression.sample_points || []} 
                      fill="#06B6D4" 
                      fillOpacity={0.65}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* SUB-TAB 3: OUTLIER DETECTION (IQR METHOD) */}
      {activeSubTab === 'outliers' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
            Outliers are detected mathematically using the <strong>Interquartile Range (IQR)</strong> rule: values falling below 
            <code className="text-cyan-300 ml-1">Q1 - 1.5 * IQR</code> or above <code className="text-cyan-300 ml-1">Q3 + 1.5 * IQR</code> are flagged as acoustic anomalies.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(outliers).map(([feat, o]) => (
              <div key={feat} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 capitalize">{feat}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    o.outlier_count > 0 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {o.outlier_count} anomalies ({o.outlier_pct}%)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-slate-400">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="block text-slate-400 uppercase">Lower Bound</span>
                    <strong className="text-white">{o.lower_bound}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="block text-slate-400 uppercase">Upper Bound</span>
                    <strong className="text-white">{o.upper_bound}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* SUB-TAB 4: FEATURE DISTRIBUTIONS */}
      {activeSubTab === 'distributions' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {FEATURE_LIST.slice(0, 8).map(f => (
              <button
                key={f}
                onClick={() => setSelectedDistFeature(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                  selectedDistFeature === f
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {currentDist && (
            <div className="space-y-4">
              {/* Distribution Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Mean</span>
                  <strong className="text-sm text-white">{currentDist.mean}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Median</span>
                  <strong className="text-sm text-cyan-400">{currentDist.median}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Std Dev</span>
                  <strong className="text-sm text-purple-300">{currentDist.std}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Skewness</span>
                  <strong className="text-sm text-amber-400">{currentDist.skewness}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Kurtosis</span>
                  <strong className="text-sm text-white">{currentDist.kurtosis}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Range [Min, Max]</span>
                  <strong className="text-sm text-white">[{currentDist.min}, {currentDist.max}]</strong>
                </div>
              </div>

              {/* Histogram Chart */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentDist.histogram || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis 
                      dataKey="bin_start" 
                      stroke="#64748B" 
                      tick={{ fill: '#64748B', fontSize: 10 }}
                    />
                    <YAxis 
                      stroke="#64748B" 
                      tick={{ fill: '#64748B', fontSize: 10 }}
                    />
                    <Tooltip 
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono">
                              <span className="text-slate-400 block">Bin: [{d.bin_start} to {d.bin_end}]</span>
                              <strong className="text-cyan-400 text-sm">Count: {d.count} tracks</strong>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                      {currentDist.histogram?.map((_, idx) => (
                        <Cell key={idx} fill={idx % 2 === 0 ? '#06B6D4' : '#8B5CF6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
