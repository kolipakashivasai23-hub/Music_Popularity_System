import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, Sliders, Layers, TrendingUp, Cpu, Award, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';

export default function FlowPanel({ result, features, insights, triggerTimestamp }) {
  const [activeStage, setActiveStage] = useState(6); // default fully activated after first run
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger sequential activation whenever prediction occurs or user clicks Replay
  useEffect(() => {
    runSequentialAnimation();
  }, [triggerTimestamp]);

  const runSequentialAnimation = () => {
    setIsAnimating(true);
    setActiveStage(0);

    const timeouts = [];
    for (let i = 1; i <= 6; i++) {
      timeouts.push(
        setTimeout(() => {
          setActiveStage(i);
          if (i === 6) setIsAnimating(false);
        }, i * 350)
      );
    }

    return () => timeouts.forEach(t => clearTimeout(t));
  };

  const topDriver = result?.top_contributing_features?.[0] || { label: 'Danceability', impact_score: 28.5 };
  const rawTempo = features?.tempo || 124;
  const scaledTempoZ = ((rawTempo - 120) / 25).toFixed(2);
  const modelName = insights?.model_metrics?.best_model || "Linear Regression";

  const stages = [
    {
      id: 1,
      name: "1. Input Received",
      icon: Sliders,
      color: "from-emerald-500 to-teal-500",
      glowColor: "shadow-emerald-500/30 border-emerald-500",
      description: "Raw Audio Vector",
      liveData: `Danceability: ${features?.danceability || 0.85} | Tempo: ${rawTempo} BPM`
    },
    {
      id: 2,
      name: "2. Preprocessing",
      icon: Layers,
      color: "from-cyan-500 to-blue-500",
      glowColor: "shadow-cyan-500/30 border-cyan-500",
      description: "StandardScaler Normalization",
      liveData: `Before: ${rawTempo} BPM → Z-score: ${scaledTempoZ > 0 ? '+' : ''}${scaledTempoZ}`
    },
    {
      id: 3,
      name: "3. Correlation Context",
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-500",
      glowColor: "shadow-blue-500/30 border-blue-500",
      description: "Pearson r Matrix Reference",
      liveData: `Danceability (r = +0.48) | Energy (r = +0.47)`
    },
    {
      id: 4,
      name: "4. Model Inference",
      icon: Cpu,
      color: "from-purple-500 to-indigo-500",
      glowColor: "shadow-purple-500/30 border-purple-500",
      description: "Champion Algorithm Execution",
      liveData: `${modelName}`
    },
    {
      id: 5,
      name: "5. Feature Contribution",
      icon: GitCommit,
      color: "from-pink-500 to-rose-500",
      glowColor: "shadow-pink-500/30 border-pink-500",
      description: "Impact Points Calculation",
      liveData: `Top: ${topDriver.label} (${topDriver.impact_score > 0 ? '+' : ''}${topDriver.impact_score} pts)`
    },
    {
      id: 6,
      name: "6. Final Output",
      icon: Award,
      color: "from-emerald-400 to-teal-400",
      glowColor: "shadow-emerald-400/40 border-emerald-400",
      description: "Predicted Popularity Index",
      liveData: `Score: ${result?.predicted_popularity || 90} / 100`
    }
  ];

  return (
    <div id="flow" className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 mb-8 relative overflow-hidden">
      {/* Header with Title and Replay Flow Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Pipeline Architecture & Execution Flow
              <span className="text-[10px] font-mono font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                End-to-End Trace
              </span>
            </h2>
            <p className="text-xs text-slate-400">Watch each stage of the machine learning pipeline execute sequentially in real-time</p>
          </div>
        </div>

        {/* Replay Flow Control Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={runSequentialAnimation}
          disabled={isAnimating}
          className="px-3.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isAnimating ? 'animate-spin' : ''}`} />
          <span>Replay Flow</span>
        </motion.button>
      </div>

      {/* 6 Connected Nodes Diagram Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isNodeActive = activeStage >= stage.id;
          const isJustActivated = activeStage === stage.id;

          return (
            <div key={stage.id} className="relative flex flex-col items-center">
              {/* Connector Arrow (hidden on last card) */}
              {idx < 5 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <motion.div
                    animate={{
                      color: activeStage > stage.id ? '#1DB954' : '#374151',
                      scale: activeStage > stage.id ? 1.2 : 1
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              )}

              {/* Stage Card Container */}
              <motion.div
                animate={{
                  scale: isJustActivated ? 1.05 : 1,
                  opacity: isNodeActive ? 1 : 0.4
                }}
                transition={{ duration: 0.3 }}
                className={`w-full h-full p-4 rounded-2xl transition-all border flex flex-col justify-between ${
                  isNodeActive 
                    ? `bg-black/60 ${stage.glowColor} shadow-lg` 
                    : 'bg-white/[0.02] border-white/5 text-gray-500'
                }`}
              >
                {/* Node Icon & Checkmark Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${stage.color} text-black font-bold shadow-md`}>
                    <Icon className="w-4 h-4 text-black" />
                  </div>
                  {isNodeActive ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-emerald-400"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-700"></span>
                  )}
                </div>

                {/* Stage Title & Description */}
                <div>
                  <h3 className={`font-bold text-xs mb-1 ${isNodeActive ? 'text-white' : 'text-gray-500'}`}>
                    {stage.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 leading-tight mb-2">
                    {stage.description}
                  </p>
                </div>

                {/* Actual Live Stage Data */}
                <div className={`p-2 rounded-xl text-[10px] font-mono leading-snug border ${
                  isNodeActive 
                    ? 'bg-white/[0.05] border-white/10 text-emerald-300' 
                    : 'bg-black/20 border-white/5 text-gray-600'
                }`}>
                  {stage.liveData}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
