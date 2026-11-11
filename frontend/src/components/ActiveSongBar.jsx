import React, { useState } from 'react';
import { 
  Music, Disc, Play, Square, Sparkles, BrainCircuit, FileText, 
  ChevronDown, Target, Zap, Volume2 
} from 'lucide-react';
import { playTrackPreview, stopTrackPreview } from '../utils/audioSynth';

export const ALL_SONG_PRESETS = [
  {
    id: "track_01",
    track_name: "Tum Hi Ho",
    artist_name: "Arijit Singh, Mithoon",
    genre: "Bollywood Pop",
    danceability: 0.76, energy: 0.78, loudness: -5.2, tempo: 95.0,
    acousticness: 0.18, instrumentalness: 0.00, speechiness: 0.04, valence: 0.74,
    note: "Blockbuster Romantic Hit"
  },
  {
    id: "track_02",
    track_name: "Shape of You",
    artist_name: "Ed Sheeran",
    genre: "Pop / Dancehall",
    danceability: 0.85, energy: 0.82, loudness: -3.8, tempo: 96.0,
    acousticness: 0.22, instrumentalness: 0.00, speechiness: 0.08, valence: 0.91,
    note: "Global Streaming Record"
  },
  {
    id: "track_03",
    track_name: "Blinding Lights",
    artist_name: "The Weeknd",
    genre: "Synth-Pop",
    danceability: 0.80, energy: 0.88, loudness: -4.0, tempo: 171.0,
    acousticness: 0.08, instrumentalness: 0.00, speechiness: 0.06, valence: 0.82,
    note: "Historic Billboard #1"
  },
  {
    id: "track_04",
    track_name: "Kesariya",
    artist_name: "Arijit Singh, Pritam",
    genre: "Bollywood Pop",
    danceability: 0.78, energy: 0.80, loudness: -5.0, tempo: 98.0,
    acousticness: 0.20, instrumentalness: 0.00, speechiness: 0.04, valence: 0.76,
    note: "Modern Chart Topper"
  },
  {
    id: "track_05",
    track_name: "Raataan Lambiyan",
    artist_name: "Jubin Nautiyal, Asees Kaur",
    genre: "Bollywood Romantic",
    danceability: 0.80, energy: 0.82, loudness: -4.8, tempo: 102.0,
    acousticness: 0.15, instrumentalness: 0.00, speechiness: 0.05, valence: 0.80,
    note: "Viral Streaming Sensation"
  },
  {
    id: "track_06",
    track_name: "Naatu Naatu",
    artist_name: "Rahul Sipligunj, Kaala Bhairava",
    genre: "Tollywood Folk / Dance",
    danceability: 0.84, energy: 0.92, loudness: -3.5, tempo: 150.0,
    acousticness: 0.12, instrumentalness: 0.00, speechiness: 0.12, valence: 0.88,
    note: "Oscar Winning Dance Track"
  },
  {
    id: "track_07",
    track_name: "Inkem Inkem Inkem Kaavaale",
    artist_name: "Sid Sriram, Gopi Sundar",
    genre: "Telugu Melodic Pop",
    danceability: 0.72, energy: 0.68, loudness: -6.5, tempo: 110.0,
    acousticness: 0.35, instrumentalness: 0.00, speechiness: 0.04, valence: 0.70,
    note: "Melodic Streaming Classic"
  },
  {
    id: "track_08",
    track_name: "Chaleya",
    artist_name: "Arijit Singh, Anirudh",
    genre: "Contemporary Pop",
    danceability: 0.82, energy: 0.84, loudness: -4.2, tempo: 122.0,
    acousticness: 0.14, instrumentalness: 0.00, speechiness: 0.06, valence: 0.85,
    note: "High-Energy Modern Hit"
  }
];

export default function ActiveSongBar({ 
  activeTrackName, 
  activeArtistName, 
  features, 
  result, 
  onSelectSong, 
  onNavigateTab 
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const score = result?.predicted_popularity || 85;
  const hitOdds = result?.hit_potential?.hit_percentage || 90;
  const tierName = result?.popularity_tier?.tier || "Mainstream Hit";

  const matchedSong = ALL_SONG_PRESETS.find(
    s => s.track_name.toLowerCase() === (activeTrackName || '').toLowerCase()
  );

  const handleToggleAudio = () => {
    if (isPlaying) {
      stopTrackPreview();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playTrackPreview(
        { ...features, tempo: features.tempo || 120 },
        () => setIsPlaying(false)
      );
    }
  };

  const handleDropdownChange = (e) => {
    const songId = e.target.value;
    const song = ALL_SONG_PRESETS.find(s => s.id === songId);
    if (song) {
      onSelectSong(song);
    }
  };

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
      {/* Current Song Details */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
          <Disc className={`w-6 h-6 ${isPlaying ? 'animate-spin' : ''}`} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">
              ACTIVE SONG
            </span>
            <span className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
              {activeTrackName || "Custom Track"}
            </span>
            <span className="text-xs text-slate-400">
              • {activeArtistName || "Studio Artist"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs mt-1 font-mono">
            <span className="text-cyan-400 font-bold">
              Popularity: <strong className="text-white text-sm">{score}</strong>/100
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">
              Hit Odds: <strong className="text-white text-sm">{hitOdds}%</strong>
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-purple-300 hidden sm:inline">
              {tierName}
            </span>
          </div>
        </div>
      </div>

      {/* Song Selector & Quick Actions */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
        {/* Switch Song Dropdown */}
        <div className="relative min-w-[180px] sm:min-w-[220px]">
          <select
            value={matchedSong ? matchedSong.id : ""}
            onChange={handleDropdownChange}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="" disabled>-- Current: {activeTrackName || "Custom Track"} --</option>
            {ALL_SONG_PRESETS.map((song) => (
              <option key={song.id} value={song.id} className="bg-slate-900 text-white">
                {song.track_name} — {song.artist_name}
              </option>
            ))}
          </select>
        </div>

        {/* Play Synthesizer Preview */}
        <button
          onClick={handleToggleAudio}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
            isPlaying 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
              : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:border-slate-600'
          }`}
        >
          {isPlaying ? <Square className="w-3.5 h-3.5 fill-rose-300" /> : <Play className="w-3.5 h-3.5 fill-slate-300" />}
          <span>{isPlaying ? "Stop" : "Preview"}</span>
        </button>

        {/* Quick Tabs Jump */}
        <button
          onClick={() => onNavigateTab('what_if')}
          title="Simulate modifying this song"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
        </button>

        <button
          onClick={() => onNavigateTab('xai')}
          title="Explain this song with SHAP"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
        >
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
    </div>
  );
}
