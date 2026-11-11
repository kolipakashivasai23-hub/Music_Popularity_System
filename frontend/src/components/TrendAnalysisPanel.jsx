import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Calendar, Volume2, Sparkles, Clock, Music, 
  Layers, Compass, Info 
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { getMusicTrends } from '../services/api';

export default function TrendAnalysisPanel() {
  const [trendData, setTrendData] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await getMusicTrends();
        setTrendData(data);
      } catch (e) {
        console.error("Failed to load trend analysis data:", e);
      }
    };
    fetchTrends();
  }, []);

  const decades = trendData?.decades || [];
  const yearly = trendData?.yearly || [];
  const keyObs = trendData?.key_observations || [];

  return (
    <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Music Trend Analysis (1980–2024)</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                44-Year Historical Archive
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical loudness war progression, danceability shifts, and acousticness evolution over 4 decades
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
          5 Eras: <strong>1980s – 2020s</strong>
        </div>
      </div>

      {/* Row 1: The Loudness War Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400" />
            The Loudness War: Dynamic Range & dB Progression (1980–2024)
          </span>
          <span className="text-xs text-slate-400">Mastering volume steadily increased over 4 decades</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={yearly} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="loudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="year" stroke="#64748B" tick={{ fill: '#64748B', fontSize: 10 }} />
              <YAxis stroke="#64748B" domain={[-20, 0]} tick={{ fill: '#64748B', fontSize: 10 }} />
              <Tooltip 
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono shadow-xl">
                        <strong className="text-white block">Year: {d.year}</strong>
                        <div className="text-cyan-400">Loudness: {d.loudness} dB</div>
                        <div className="text-purple-400">Popularity: {d.popularity}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="loudness" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#loudGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Changing Audio Characteristics (Danceability vs Acousticness) */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Music className="w-4 h-4 text-cyan-400" />
            Changing Audio Profiles: Danceability Rise vs Acousticness Decline
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yearly} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="year" stroke="#64748B" tick={{ fill: '#64748B', fontSize: 10 }} />
              <YAxis stroke="#64748B" domain={[0, 1]} tick={{ fill: '#64748B', fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" name="Danceability" dataKey="danceability" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" name="Acousticness" dataKey="acousticness" stroke="#F43F5E" strokeWidth={2} dot={false} />
              <Line type="monotone" name="Energy" dataKey="energy" stroke="#8B5CF6" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Decadal Cards Breakdown */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <span className="text-xs font-semibold text-slate-300 block">
          Decadal Benchmarks:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {decades.map((d) => (
            <div key={d.decade} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-cyan-400 font-mono">{d.decade}</span>
                <span className="text-[10px] text-slate-400 font-semibold">{d.track_count} tracks</span>
              </div>
              <div className="text-xs font-mono space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Loudness:</span>
                  <strong className="text-white">{d.avg_loudness} dB</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dance:</span>
                  <strong className="text-emerald-400">{d.avg_danceability}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Acoustic:</span>
                  <strong className="text-rose-400">{d.avg_acousticness}</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Avg Pop:</span>
                  <strong className="text-cyan-400">{d.avg_popularity}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Observations */}
      {keyObs.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Info className="w-4 h-4 text-cyan-400" />
            Key Historical Findings
          </span>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            {keyObs.map((obs, idx) => (
              <li key={idx}>{obs}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
