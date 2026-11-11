import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Flame, Target } from 'lucide-react';

export default function DashboardKPIs({ insights, onOpenAssistant, onOpenReports }) {
  const modelName = insights?.model_metrics?.best_model || "XGBoost Regressor";
  const r2Score = insights?.model_metrics?.models?.[modelName]?.r2 || 0.9102;
  const classifierName = insights?.model_metrics?.best_classifier || "Random Forest Classifier";
  const accuracy = insights?.model_metrics?.classifier_models?.[classifierName]?.accuracy || 0.8702;

  const kpis = [
    {
      label: "Indexed Corpus",
      value: "4,200+",
      sub: "10 Genres • 1980–2024",
      icon: Database,
      color: "from-cyan-500 to-blue-500",
      border: "border-cyan-500/30",
      text: "text-cyan-400"
    },
    {
      label: "Champion Model",
      value: `${(r2Score * 100).toFixed(1)}% R²`,
      sub: modelName,
      icon: Cpu,
      color: "from-purple-500 to-indigo-500",
      border: "border-purple-500/30",
      text: "text-purple-400"
    },
    {
      label: "Hit Classifier",
      value: `${(accuracy * 100).toFixed(1)}% Acc`,
      sub: "ROC-AUC 0.949",
      icon: Target,
      color: "from-emerald-500 to-teal-500",
      border: "border-emerald-500/30",
      text: "text-emerald-400"
    },
    {
      label: "Top Audio Driver",
      value: "Danceability",
      sub: "r = +0.485 (SHAP #1)",
      icon: Flame,
      color: "from-amber-500 to-orange-500",
      border: "border-amber-500/30",
      text: "text-amber-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            className={`p-3.5 sm:p-4 rounded-2xl bg-black/40 backdrop-blur-md border ${kpi.border} flex items-center gap-3 relative overflow-hidden group hover:border-white/20 transition-all`}
          >
            <div className={`p-2 sm:p-2.5 rounded-xl bg-gradient-to-br ${kpi.color} bg-opacity-20 flex items-center justify-center text-black font-extrabold shadow-md`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block truncate">
                {kpi.label}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-base sm:text-lg font-black font-mono tracking-tight text-white`}>
                  {kpi.value}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block truncate font-medium">
                {kpi.sub}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
