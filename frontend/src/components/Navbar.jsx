import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Music, Sliders, GitCommit, Radio, TrendingUp, Disc, 
  Target, Activity, BarChart3, BrainCircuit, GitCompare, Compass, 
  FileText, User, Bot 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAssistant }) {
  const tabs = [
    { id: 'predictor', label: 'Studio Predictor', icon: Sliders },
    { id: 'hit_analyzer', label: 'Hit Potential', icon: Target },
    { id: 'what_if', label: 'What-If Lab', icon: Sparkles },
    { id: 'audio_lab', label: 'Audio Lab (Librosa)', icon: Activity },
    { id: 'stats_lab', label: 'Statistical Lab', icon: BarChart3 },
    { id: 'xai', label: 'SHAP (XAI)', icon: BrainCircuit },
    { id: 'genres', label: 'Genre Intelligence', icon: Radio },
    { id: 'compare', label: 'Song Compare', icon: GitCompare },
    { id: 'trends', label: 'Music Trends', icon: TrendingUp },
    { id: 'recommendations', label: 'Recommendations', icon: Compass },
    { id: 'insights', label: 'Model Analytics', icon: TrendingUp },
    { id: 'jukebox', label: 'Real Jukebox', icon: Disc },
    { id: 'flow', label: 'How It Works', icon: GitCommit },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
    { id: 'profile', label: 'Personal Hub', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#070A11]/90 border-b border-white/10 px-4 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div 
            onClick={() => setActiveTab('predictor')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Logo Mark Icon: Soundwave + AI Spark Glow */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#070A11] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <Music className="w-5 h-5 text-cyan-400" />
                <Sparkles className="w-3 h-3 text-purple-400 absolute top-1 right-1 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white font-display">
                  SONIQ<span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">AI</span>
                </span>
              </div>
              <p className="text-[11px] font-bold text-gray-400 tracking-wide -mt-0.5">
                Music Intelligence Platform
              </p>
            </div>
          </div>

          {/* AI Copilot Launch Button (Mobile) */}
          <button
            onClick={onOpenAssistant}
            className="lg:hidden px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
          >
            <Bot className="w-4 h-4" />
            <span>AI Copilot</span>
          </button>
        </div>

        {/* Scrollable Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-black/60 rounded-2xl border border-white/10 text-xs font-bold overflow-x-auto max-w-full scrollbar-none py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap text-xs ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-black shadow-lg shadow-cyan-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* AI Copilot Launch Button (Desktop) */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={onOpenAssistant}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer hover:scale-105"
          >
            <Bot className="w-4 h-4 text-cyan-200 animate-pulse" />
            <span>AI Copilot</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
