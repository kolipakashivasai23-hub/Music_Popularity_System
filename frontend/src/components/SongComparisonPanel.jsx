import React, { useState, useEffect } from 'react';
import { GitCompare, Trophy, Trash2, ArrowRight } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { compareSongs } from '../services/api';

const COLORS = ['#06B6D4', '#8B5CF6', '#10B981', '#F59E0B'];

export default function SongComparisonPanel({ activeTrackName, activeArtistName, activeFeatures, sampleTracks }) {
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);

  useEffect(() => {
    // Initialize comparison with active track as Track #1
    const currentTrack = {
      name: activeTrackName || "Current Track",
      artist: activeArtistName || "Studio Artist",
      features: activeFeatures
    };

    const benchmark1 = {
      name: "Shape of You",
      artist: "Ed Sheeran",
      features: {
        danceability: 0.85, energy: 0.82, loudness: -3.8, tempo: 96.0,
        acousticness: 0.22, instrumentalness: 0.00, speechiness: 0.08, valence: 0.91
      }
    };

    const benchmark2 = {
      name: "Tum Hi Ho",
      artist: "Arijit Singh",
      features: {
        danceability: 0.76, energy: 0.78, loudness: -5.2, tempo: 95.0,
        acousticness: 0.18, instrumentalness: 0.00, speechiness: 0.04, valence: 0.74
      }
    };

    const initial = [currentTrack, benchmark1, benchmark2];
    setSelectedTracks(initial);
    compareSongs(initial).then(res => setComparisonResult(res)).catch(console.error);
  }, [activeTrackName, activeArtistName, activeFeatures]);

  const handleAddTrack = (track) => {
    if (selectedTracks.length >= 4) return;
    if (selectedTracks.some(t => t.name === (track.track_name || track.name))) return;

    const newTrack = {
      name: track.track_name || track.name,
      artist: track.artist || track.artist_name || "Artist",
      features: {
        danceability: track.danceability,
        energy: track.energy,
        loudness: track.loudness,
        tempo: track.tempo,
        acousticness: track.acousticness,
        instrumentalness: track.instrumentalness,
        speechiness: track.speechiness,
        valence: track.valence
      }
    };
    const updated = [...selectedTracks, newTrack];
    setSelectedTracks(updated);
    compareSongs(updated).then(res => setComparisonResult(res)).catch(console.error);
  };

  const handleRemoveTrack = (index) => {
    if (selectedTracks.length <= 2) return;
    const updated = selectedTracks.filter((_, i) => i !== index);
    setSelectedTracks(updated);
    compareSongs(updated).then(res => setComparisonResult(res)).catch(console.error);
  };

  const subjects = ['Danceability', 'Energy', 'Valence', 'Acousticness', 'Instrumental', 'Loudness'];
  const multiRadarData = subjects.map(subject => {
    const row = { subject };
    comparisonResult?.tracks?.forEach((t) => {
      const f = t.features;
      let val = 0;
      if (subject === 'Danceability') val = Math.round(f.danceability * 100);
      else if (subject === 'Energy') val = Math.round(f.energy * 100);
      else if (subject === 'Valence') val = Math.round(f.valence * 100);
      else if (subject === 'Acousticness') val = Math.round(f.acousticness * 100);
      else if (subject === 'Instrumental') val = Math.round(f.instrumentalness * 100);
      else if (subject === 'Loudness') val = Math.round(Math.min(100, Math.max(0, (f.loudness + 30) / 30 * 100)));
      row[t.name] = val;
    });
    return row;
  });

  const barData = comparisonResult?.tracks?.map(t => ({
    name: t.name,
    predicted_popularity: t.predicted_popularity,
    hit_percentage: t.hit_percentage
  })) || [];

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/60 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Song Comparison Studio</h2>
            <p className="text-xs text-slate-400">
              Comparing <strong className="text-cyan-300">{activeTrackName || "Your Song"}</strong> against Benchmark Chart Hits
            </p>
          </div>
        </div>

        {comparisonResult?.winner && (
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Leader: <strong>{comparisonResult.winner.name}</strong> ({comparisonResult.winner.score}/100)</span>
          </div>
        )}
      </div>

      {/* Selected Tracks Tag Row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 mr-1">Compared Tracks:</span>
        {selectedTracks.map((t, idx) => (
          <div
            key={idx}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white flex items-center gap-2"
          >
            <span 
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              className="w-2 h-2 rounded-full"
            />
            <span>{t.name}</span>
            {selectedTracks.length > 2 && idx !== 0 && (
              <button
                onClick={() => handleRemoveTrack(idx)}
                className="text-slate-400 hover:text-rose-400 transition cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {sampleTracks && selectedTracks.length < 4 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-auto">
            <span>Add:</span>
            {sampleTracks.slice(0, 3).map(st => (
              <button
                key={st.id}
                onClick={() => handleAddTrack(st)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition cursor-pointer"
              >
                + {st.track_name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Visualizations: Radar & Grouped Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center">
          <span className="text-xs font-semibold text-slate-300 mb-2">Acoustic Dimensions Radar Overlay</span>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={multiRadarData}>
                <PolarGrid stroke="#1E293B" />
                <PolarAngleAxis dataKey="subject" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#334155" tick={false} />
                {comparisonResult?.tracks?.map((t, i) => (
                  <Radar
                    key={t.name}
                    name={t.name}
                    dataKey={t.name}
                    stroke={COLORS[i % COLORS.length]}
                    fill={COLORS[i % COLORS.length]}
                    fillOpacity={0.2}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grouped Bar Chart */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center">
          <span className="text-xs font-semibold text-slate-300 mb-2">Popularity Index & Hit Probability</span>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 15, right: 15, bottom: 15, left: -15 }}>
                <XAxis dataKey="name" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <YAxis stroke="#64748B" domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar name="Popularity Index" dataKey="predicted_popularity" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                <Bar name="Hit Odds (%)" dataKey="hit_percentage" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Delta Table */}
      <div className="overflow-x-auto p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="p-2.5 text-left font-semibold">Track</th>
              <th className="p-2.5 text-center font-semibold">Danceability</th>
              <th className="p-2.5 text-center font-semibold">Energy</th>
              <th className="p-2.5 text-center font-semibold">Loudness</th>
              <th className="p-2.5 text-center font-semibold">Tempo</th>
              <th className="p-2.5 text-center font-semibold">Acousticness</th>
              <th className="p-2.5 text-right font-semibold">Popularity</th>
            </tr>
          </thead>
          <tbody>
            {comparisonResult?.tracks?.map((t, idx) => (
              <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-900/40 transition">
                <td className="p-2.5 text-left font-bold text-white font-sans">
                  {t.name}
                  {idx === 0 && <span className="ml-1.5 text-[9px] text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-500/20">TARGET</span>}
                </td>
                <td className="p-2.5 text-center text-slate-300">{t.features.danceability}</td>
                <td className="p-2.5 text-center text-slate-300">{t.features.energy}</td>
                <td className="p-2.5 text-center text-slate-300">{t.features.loudness} dB</td>
                <td className="p-2.5 text-center text-slate-300">{t.features.tempo} BPM</td>
                <td className="p-2.5 text-center text-slate-300">{t.features.acousticness}</td>
                <td className="p-2.5 text-right font-bold text-cyan-400">
                  {t.predicted_popularity}/100
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
