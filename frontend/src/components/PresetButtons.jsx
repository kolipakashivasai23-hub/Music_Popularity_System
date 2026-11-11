import React from 'react';
import { motion } from 'framer-motion';
import { Disc, Zap, Headphones, Mic2, Flame } from 'lucide-react';

export const PRESETS = [
  {
    name: 'Pop Hit',
    icon: Flame,
    color: 'from-emerald-500 to-teal-500',
    features: {
      danceability: 0.85,
      energy: 0.82,
      loudness: -5.0,
      tempo: 124,
      acousticness: 0.12,
      instrumentalness: 0.01,
      speechiness: 0.07,
      valence: 0.78
    }
  },
  {
    name: 'EDM Banger',
    icon: Zap,
    color: 'from-purple-500 to-indigo-500',
    features: {
      danceability: 0.88,
      energy: 0.95,
      loudness: -3.5,
      tempo: 128,
      acousticness: 0.04,
      instrumentalness: 0.42,
      speechiness: 0.11,
      valence: 0.65
    }
  },
  {
    name: 'Lo-fi Chill',
    icon: Headphones,
    color: 'from-blue-500 to-cyan-500',
    features: {
      danceability: 0.45,
      energy: 0.35,
      loudness: -14.0,
      tempo: 85,
      acousticness: 0.75,
      instrumentalness: 0.68,
      speechiness: 0.06,
      valence: 0.42
    }
  },
  {
    name: 'Acoustic Ballad',
    icon: Mic2,
    color: 'from-amber-500 to-orange-500',
    features: {
      danceability: 0.52,
      energy: 0.38,
      loudness: -12.0,
      tempo: 74,
      acousticness: 0.88,
      instrumentalness: 0.0,
      speechiness: 0.04,
      valence: 0.48
    }
  }
];

export default function PresetButtons({ onSelectPreset, activePreset }) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
          <Disc className="w-3.5 h-3.5 text-emerald-400" />
          Quick Demo Preset Tracks
        </span>
        <span className="text-xs text-gray-500">Auto-fills audio feature sliders</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isActive = activePreset === preset.name;
          return (
            <motion.button
              key={preset.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectPreset(preset)}
              className={`flex items-center gap-2.5 p-3 rounded-xl text-left transition-all border ${
                isActive 
                  ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${preset.color} text-white shadow-md`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold leading-none">{preset.name}</div>
                <div className="text-[10px] text-gray-400 mt-1">{preset.features.tempo} BPM</div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
