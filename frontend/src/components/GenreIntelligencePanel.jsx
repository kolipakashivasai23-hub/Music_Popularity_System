import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Radio, Music, Layers, BarChart2, CheckCircle2, TrendingUp, Flame, 
  Sparkles, Compass 
} from 'lucide-react';
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
  Cell
} from 'recharts';
import { getGenreIntelligence } from '../services/api';

export default function GenreIntelligencePanel() {
  const [genreData, setGenreData] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('Pop');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenreIntelligence();
        setGenreData(data);
      } catch (e) {
        console.error("Failed to load genre intelligence:", e);
      }
    };
    fetchGenres();
  }, []);

  const genresDict = genreData?.genres || {};
  const clusters = genreData?.clusters || [];

  // Bar chart data for popularity by genre
  const popChartData = Object.entries(genresDict).map(([gName, gInfo]) => ({
    genre: gName,
    avg_pop: gInfo.avg_popularity,
    hit_rate: gInfo.hit_rate_pct,
    track_count: gInfo.track_count
  })).sort((a, b) => b.avg_pop - a.avg_pop);

  // Radar data for selected genre
  const selectedProfile = genresDict[selectedGenre]?.features || {};
  const radarData = [
    { subject: 'Danceability', value: Math.round((selectedProfile.danceability || 0.7) * 100) },
    { subject: 'Energy', value: Math.round((selectedProfile.energy || 0.7) * 100) },
    { subject: 'Valence', value: Math.round((selectedProfile.valence || 0.6) * 100) },
    { subject: 'Acousticness', value: Math.round((selectedProfile.acousticness || 0.2) * 100) },
    { subject: 'Instrumental', value: Math.round((selectedProfile.instrumentalness || 0.05) * 100) },
    { subject: 'Speechiness', value: Math.round((selectedProfile.speechiness || 0.08) * 100) }
  ];

  return (
    <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Genre Intelligence & Audio Clusters</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                10 Genres • K-Means (k=4)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore genre popularity benchmarks, acoustic fingerprints, and musical unsupervised clusters
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
          Top Genre: <strong>{genreData?.top_genre_by_popularity || "Pop"}</strong>
        </div>
      </div>

      {/* Row 1: Average Popularity Across 10 Genres */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            Average Popularity Index & Commercial Hit Rate by Genre
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={popChartData} margin={{ top: 15, right: 15, left: -10, bottom: 25 }}>
              <XAxis dataKey="genre" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11 }} angle={-25} textAnchor="end" />
              <YAxis stroke="#64748B" domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10 }} />
              <Tooltip 
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs shadow-xl font-mono">
                        <strong className="text-white text-sm block mb-1">{d.genre}</strong>
                        <div className="text-emerald-400">Avg Popularity: {d.avg_pop} / 100</div>
                        <div className="text-cyan-400">Hit Rate: {d.hit_rate}%</div>
                        <div className="text-slate-400 text-[10px]">{d.track_count} indexed tracks</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="avg_pop" radius={[6, 6, 0, 0]}>
                {popChartData.map((entry, idx) => (
                  <Cell 
                    key={idx} 
                    fill={entry.genre === selectedGenre ? '#06B6D4' : idx < 3 ? '#10B981' : idx < 6 ? '#8B5CF6' : '#64748B'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Genre Selector & Radar Fingerprint */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-4 border-t border-slate-800">
        {/* Genre Selector Pills */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-semibold text-slate-300 block">
            Inspect Genre Audio Fingerprint:
          </span>

          <div className="grid grid-cols-2 gap-2">
            {Object.keys(genresDict).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`p-2.5 rounded-xl text-xs font-semibold text-left transition cursor-pointer flex items-center justify-between border ${
                  selectedGenre === g
                    ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{g}</span>
                <span className="text-[10px] font-mono text-slate-500">
                  {genresDict[g].avg_popularity} pts
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
          <div className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>{selectedGenre} Acoustic Dimension Fingerprint</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#475569" tick={false} />
                <Radar name={selectedGenre} dataKey="value" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: K-Means Musical Archetype Clusters */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-purple-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Unsupervised K-Means Musical Archetypes (k=4)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {clusters.map((c) => (
            <div key={c.cluster_id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-purple-400">Cluster {c.cluster_id + 1}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                  {c.track_count} tracks
                </span>
              </div>

              <h4 className="text-sm font-semibold text-white leading-tight">{c.name}</h4>

              <div className="pt-1 text-xs font-mono space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Popularity:</span>
                  <strong className="text-cyan-400">{c.avg_popularity}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hit Rate:</span>
                  <strong className="text-emerald-400">{c.hit_rate_pct}%</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Dominant: {Object.keys(c.dominant_genres || {}).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
