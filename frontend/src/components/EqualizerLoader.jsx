import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function EqualizerLoader({ error, onRetry }) {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Backend Server Error</h3>
            <p className="text-xs text-rose-300 mt-0.5">{error}</p>
          </div>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold flex items-center gap-2 hover:bg-rose-600 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Connection
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="p-8 rounded-3xl glass-card border border-white/10 mb-8 flex flex-col items-center justify-center gap-4 text-center">
      {/* Equalizer Wave Loader */}
      <div className="flex items-end gap-2 h-12">
        {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8, 0.3].map((val, i) => (
          <motion.div
            key={i}
            className="w-2 bg-gradient-to-t from-emerald-500 to-purple-500 rounded-full"
            animate={{
              height: ['20%', '100%', '30%'],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
      <p className="text-sm font-semibold text-gray-300 animate-pulse">
        Processing Audio Features & Running ML Regression...
      </p>
    </div>
  );
}
