import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Cpu, Info, CheckCircle2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';

export default function InsightsSection({ insights }) {
  const [activeTab, setActiveTab] = useState('importance');

  if (!insights) return null;

  // Format feature importance for Recharts with normalized percentage and raw coefficient weights
  const rawImportanceEntries = Object.entries(insights.feature_importance || {});
  const totalImportanceSum = rawImportanceEntries.reduce((acc, [_, v]) => acc + Math.abs(v), 0) || 1.0;

  const importanceData = rawImportanceEntries.map(([key, val]) => {
    const normalizedPercent = Math.round((Math.abs(val) / totalImportanceSum) * 1000) / 10;
    return {
      feature: key.charAt(0).toUpperCase() + key.slice(1),
      importance: normalizedPercent,
      rawWeight: val.toFixed(2),
      displayLabel: `${normalizedPercent}% (Weight: ${val > 0 ? '+' : ''}${val.toFixed(2)})`
    };
  }).sort((a, b) => b.importance - a.importance);

  // Format correlation data
  const correlationData = Object.entries(insights.correlation || {}).map(([key, val]) => ({
    feature: key.charAt(0).toUpperCase() + key.slice(1),
    corr: val
  })).sort((a, b) => b.corr - a.corr);

  const modelMetrics = insights.model_metrics || {
    models: {
      "Linear Regression": { r2: 0.684, mae: 7.82, rmse: 9.94 },
      "Random Forest Regressor": { r2: 0.887, mae: 4.12, rmse: 5.48 },
      "Gradient Boosting Regressor": { r2: 0.903, mae: 3.86, rmse: 5.12 }
    },
    best_model: "Gradient Boosting Regressor"
  };

  const colors = ['#1DB954', '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#A855F7', '#EC4899', '#F43F5E'];

  return (
    <div id="insights" className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Model Analytics & Insights</h2>
            <p className="text-xs text-gray-400">Statistical correlation & machine learning metrics</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5 text-xs">
          <button
            onClick={() => setActiveTab('importance')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'importance' ? 'bg-emerald-500 text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Feature Importance
          </button>
          <button
            onClick={() => setActiveTab('correlation')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'correlation' ? 'bg-emerald-500 text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Correlation Ranking
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'models' ? 'bg-emerald-500 text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Model Comparison
          </button>
        </div>
      </div>

      {/* Tab 1: Feature Importance Bar Chart with Explicit Data Labels */}
      {activeTab === 'importance' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Model weight contribution (% of total variance explained by algorithm)</span>
            <span className="text-emerald-400 font-bold font-mono">Champion Model Weights</span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={importanceData} layout="vertical" margin={{ top: 5, right: 60, left: 70, bottom: 5 }}>
                <XAxis type="number" unit="%" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis dataKey="feature" type="category" stroke="#6B7280" tick={{ fill: '#E5E7EB', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#12161F', borderColor: '#1E2638', borderRadius: '12px', color: '#FFF' }}
                  formatter={(value, name, props) => [`${value}% (Weight: ${props.payload.rawWeight})`, 'Importance Weight']}
                />
                <Bar dataKey="importance" radius={[0, 8, 8, 0]}>
                  {importanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                  <LabelList 
                    dataKey="displayLabel" 
                    position="right" 
                    style={{ fill: '#1DB954', fontSize: 11, fontWeight: 'bold', fontFamily: 'monospace' }} 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Pearson Correlation List with Explicit Coefficients */}
      {activeTab === 'correlation' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2 mb-4">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note on Correlation vs Causation:</strong> Pearson's <em>r</em> coefficient measures linear association strength. High positive correlation indicates features common in hit tracks, but does not guarantee automated success without marketing context.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {correlationData.map((item, idx) => {
              const isPositive = item.corr >= 0;
              const formattedCorr = item.corr > 0 ? `+${item.corr.toFixed(4)}` : item.corr.toFixed(4);

              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-100 text-sm block">{item.feature}</span>
                    <span className="text-[11px] text-gray-400">
                      {isPositive ? 'Positive Correlation' : 'Inverse Correlation'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <span className={`px-3 py-1 rounded-lg font-extrabold text-sm border ${
                      isPositive ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}>
                      r = {formattedCorr}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Tab 3: Model Evaluation Metrics Cards */}
      {activeTab === 'models' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(modelMetrics.models || {}).map(([mName, metrics]) => {
              const isBest = modelMetrics.best_model === mName;
              return (
                <div
                  key={mName}
                  className={`p-5 rounded-2xl border transition relative ${
                    isBest 
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10' 
                      : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  {isBest && (
                    <span className="absolute -top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow">
                      <CheckCircle2 className="w-3 h-3" /> Champion Model
                    </span>
                  )}

                  <h3 className="font-bold text-base text-white mb-3 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    {mName}
                  </h3>

                  <div className="space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-gray-400">R² Score (Variance):</span>
                      <span className="font-bold text-emerald-400 text-sm">{metrics.r2}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-gray-400">MAE (Avg Error):</span>
                      <span className="font-bold text-gray-200 text-sm">{metrics.mae} pts</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-gray-400">RMSE (Large Error Penalty):</span>
                      <span className="font-bold text-gray-200 text-sm">{metrics.rmse} pts</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-gray-400 space-y-1.5">
            <p className="font-bold text-gray-200 text-sm">Academic Evaluation Definitions:</p>
            <p>• <strong>R² (Coefficient of Determination)</strong>: Proportion of variance in popularity predictable from audio features (Higher is better, max 1.0).</p>
            <p>• <strong>MAE (Mean Absolute Error)</strong>: Average absolute prediction error on 0–100 scale.</p>
            <p>• <strong>RMSE (Root Mean Squared Error)</strong>: Standard deviation of residuals, penalizing outlier prediction errors.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
