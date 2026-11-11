import React from 'react';
import { 
  Sliders, Target, Sparkles, Activity, BarChart3, BrainCircuit, 
  Radio, GitCompare, TrendingUp, Compass, Disc, GitCommit, 
  FileText, User, Bot, Music, ChevronRight
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  activeTrackName, 
  activeArtistName, 
  currentScore, 
  onOpenAssistant 
}) {
  const navSections = [
    {
      title: "Active Song Studio",
      items: [
        { id: 'predictor', label: 'Studio Predictor', icon: Sliders, badge: 'Core' },
        { id: 'hit_analyzer', label: 'Hit Potential', icon: Target },
        { id: 'what_if', label: 'What-If Simulator', icon: Sparkles },
        { id: 'xai', label: 'Explainable AI (SHAP)', icon: BrainCircuit },
      ]
    },
    {
      title: "Audio & Matching",
      items: [
        { id: 'audio_lab', label: 'Upload & DSP (Librosa)', icon: Activity },
        { id: 'recommendations', label: 'Similar Songs', icon: Compass },
        { id: 'compare', label: 'Compare Songs', icon: GitCompare },
      ]
    },
    {
      title: "Dataset & Intelligence",
      items: [
        { id: 'stats_lab', label: 'Statistical Lab', icon: BarChart3 },
        { id: 'genres', label: 'Genre Intelligence', icon: Radio },
        { id: 'trends', label: 'Historical Trends', icon: TrendingUp },
        { id: 'jukebox', label: 'Real Track Jukebox', icon: Disc },
        { id: 'flow', label: 'Pipeline Architecture', icon: GitCommit },
      ]
    },
    {
      title: "Export & History",
      items: [
        { id: 'reports', label: 'PDF Report & Export', icon: FileText },
        { id: 'profile', label: 'Prediction History', icon: User },
      ]
    }
  ];

  return (
    <aside className="w-64 lg:w-72 bg-[#0B0E14] border-r border-slate-800 flex flex-col shrink-0 h-full z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div 
          onClick={() => setActiveTab('predictor')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/10">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white">
                SONIQ<span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 tracking-wide">
              Music Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* Active Song Focus Card */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
          <span>Target Song Focus</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div 
          onClick={() => setActiveTab('predictor')}
          className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <strong className="text-xs text-white truncate max-w-[150px] block font-semibold">
              {activeTrackName || "Custom Studio Track"}
            </strong>
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">
              {currentScore || 85} / 100
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block truncate mt-0.5">
            {activeArtistName || "Studio Artist"}
          </span>
        </div>
      </div>

      {/* Vertical Navigation Sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {section.title}
            </span>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/40 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 uppercase">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistant Quick Trigger at Bottom */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
        <button
          onClick={onOpenAssistant}
          className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-between transition shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-200" />
            <span>AI Music Copilot</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-200" />
        </button>
      </div>
    </aside>
  );
}
