import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, History, Heart, Trash2, ArrowRight, Check, Sparkles, 
  RotateCcw, Sliders, Music 
} from 'lucide-react';
import { 
  getPredictionHistory, clearPredictionHistory, getFavoriteTracks, 
  getUserProfile, saveUserProfile 
} from '../utils/storage';

export default function PersonalizationPanel({ onRestoreFeatures, onNavigateTab }) {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [profile, setProfile] = useState({
    username: 'Audio Engineer',
    targetGenre: 'Pop',
    preferredTempo: 124,
    experienceLevel: 'Professional Producer',
    bio: 'Crafting chart-topping records with SONIQ AI audio intelligence.'
  });
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    setHistory(getPredictionHistory());
    setFavorites(getFavoriteTracks());
    setProfile(getUserProfile());
  }, []);

  const handleClearHistory = () => {
    const updated = clearPredictionHistory();
    setHistory(updated);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    saveUserProfile(profile);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Personalization Hub & History</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-semibold border border-purple-500/20">
                Preferences
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Review your historical track predictions, bookmarked songs, and tailored production sound profile
            </p>
          </div>
        </div>

        {isSavedNotice && (
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-pulse">
            <Check className="w-4 h-4" /> Preferences saved!
          </span>
        )}
      </div>

      {/* Dual Columns: Profile Settings & Favorites / History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: User Sound Profile Form */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="text-xs font-semibold text-purple-400 flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            Sound Profile & Producer Preferences
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Producer / Artist Alias</label>
              <input
                type="text"
                value={profile.username || ''}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Primary Focus Genre</label>
              <select
                value={profile.targetGenre || 'Pop'}
                onChange={(e) => setProfile({ ...profile, targetGenre: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 transition cursor-pointer"
              >
                {['Pop', 'Hip-Hop', 'Electronic', 'Rock', 'R&B', 'Latin', 'Indie', 'Classical'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Target BPM Sweet Spot</label>
              <input
                type="number"
                min="50"
                max="200"
                value={profile.preferredTempo || 124}
                onChange={(e) => setProfile({ ...profile, preferredTempo: parseInt(e.target.value) || 120 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Studio Bio & Production Notes</label>
              <textarea
                rows={3}
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 font-semibold transition cursor-pointer"
            >
              Update Studio Profile
            </button>
          </form>
        </div>

        {/* Right: Prediction History & Bookmarked Tracks */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Recent Prediction History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <History className="w-4 h-4 text-purple-400" />
                Recent Prediction History ({history.length})
              </span>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {history.length > 0 ? (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition"
                  >
                    <div>
                      <span className="font-semibold text-white block">{item.track_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-cyan-400 text-sm">
                        {item.score}/100
                      </span>
                      <button
                        onClick={() => {
                          if (onRestoreFeatures) onRestoreFeatures(item.features);
                          if (onNavigateTab) onNavigateTab('predictor');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition text-[11px] font-semibold cursor-pointer"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                  No predictions saved yet. Run predictions in the studio to build your history!
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Bookmarked Favorite Tracks */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-rose-400" />
              Bookmarked Tracks ({favorites.length})
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {favorites.length > 0 ? (
                favorites.map((fav, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white block truncate max-w-[140px]">{fav.track_name}</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">{fav.artist_name || fav.artist}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (onRestoreFeatures) onRestoreFeatures(fav);
                        if (onNavigateTab) onNavigateTab('predictor');
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-[10px] font-semibold transition cursor-pointer"
                    >
                      Load
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                  Star songs in the Jukebox or Recommendation Engine to pin them here!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

