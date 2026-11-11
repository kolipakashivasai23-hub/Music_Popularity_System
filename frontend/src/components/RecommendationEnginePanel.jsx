import React, { useState, useEffect } from 'react';
import { 
  Compass, Sparkles, Smile, Radio, Flame, ArrowRight, Play, Square, Heart 
} from 'lucide-react';
import { getRecommendations } from '../services/api';
import { playTrackPreview, stopTrackPreview } from '../utils/audioSynth';
import { toggleFavoriteTrack, getFavoriteTracks } from '../utils/storage';

export default function RecommendationEnginePanel({ 
  currentFeatures, 
  trackName, 
  artistName, 
  onSelectTrackForPredictor 
}) {
  const [activeMode, setActiveMode] = useState('similar');
  const [selectedMood, setSelectedMood] = useState('Euphoric');
  const [selectedGenre, setSelectedGenre] = useState('Pop');
  const [recommendations, setRecommendations] = useState([]);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [favorites, setFavorites] = useState(getFavoriteTracks());

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const data = await getRecommendations({
          mode: activeMode,
          features: currentFeatures,
          mood: selectedMood,
          genre: selectedGenre,
          limit: 8
        });
        setRecommendations(data.recommendations || []);
      } catch (e) {
        console.error("Failed to load recommendations:", e);
      }
    };
    fetchRecs();
  }, [activeMode, selectedMood, selectedGenre, currentFeatures]);

  const handleTogglePlay = (track) => {
    if (playingTrackId === track.track_id) {
      stopTrackPreview();
      setPlayingTrackId(null);
    } else {
      stopTrackPreview();
      setPlayingTrackId(track.track_id);
      playTrackPreview(track, () => setPlayingTrackId(null));
    }
  };

  const handleToggleFav = (track) => {
    const updated = toggleFavoriteTrack(track);
    setFavorites(updated);
  };

  const isFav = (tId) => favorites.some(f => f.track_id === tId || f.id === tId);

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/60 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Music Recommendation Engine</h2>
            <p className="text-xs text-slate-400">
              Matching acoustic vectors for <strong className="text-cyan-300">{trackName || "Selected Song"}</strong> {artistName ? `by ${artistName}` : ''}
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          {[
            { id: 'similar', label: 'Similar Tracks' },
            { id: 'mood', label: 'Mood' },
            { id: 'genre', label: 'Genre' },
            { id: 'underrated', label: 'Underrated Gems' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer text-xs ${
                activeMode === m.id
                  ? 'bg-cyan-500 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Filters */}
      {activeMode === 'mood' && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Target Vibe:</span>
          {['Euphoric', 'Chill', 'Workout', 'Melancholic'].map(mood => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                selectedMood === mood
                  ? 'bg-slate-200 text-black font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      )}

      {activeMode === 'genre' && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 mr-1">Genre:</span>
          {['Pop', 'Hip-Hop', 'Electronic', 'Rock', 'R&B', 'Latin', 'Indie', 'Classical'].map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                selectedGenre === g
                  ? 'bg-slate-200 text-black font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {/* Track Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {recommendations.map((track, idx) => {
          const isPlaying = playingTrackId === track.track_id;
          const favorited = isFav(track.track_id);

          return (
            <div
              key={track.track_id || idx}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {track.track_name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {track.artist_name || "Unknown"} • {track.genre}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleFav(track)}
                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                    favorited ? 'bg-rose-500/15 text-rose-400 border-rose-500/20' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-rose-400' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                {track.similarity_pct ? (
                  <span className="text-cyan-400 font-bold">
                    {track.similarity_pct}% Similarity
                  </span>
                ) : (
                  <span className="text-purple-300 font-bold">
                    Score: {track.popularity}/100
                  </span>
                )}
                <span className="text-slate-400 text-[11px]">{track.release_year || "2022"}</span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleTogglePlay(track)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                    isPlaying 
                      ? 'bg-rose-500/20 text-rose-300' 
                      : 'bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                >
                  {isPlaying ? <Square className="w-3 h-3 fill-rose-300" /> : <Play className="w-3 h-3 fill-slate-300" />}
                  <span>{isPlaying ? "Stop" : "Preview"}</span>
                </button>

                <button
                  onClick={() => onSelectTrackForPredictor && onSelectTrackForPredictor(track)}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Select Track</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
