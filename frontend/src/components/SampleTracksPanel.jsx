import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Info, Volume2, VolumeX, Music, ExternalLink, Cpu } from 'lucide-react';
import { playTrackAudio, stopTrackAudio, openYoutubeLink } from '../utils/audioPlayer';
import { playTrackPreview, stopTrackPreview } from '../utils/audioSynth';

export default function SampleTracksPanel({ sampleTracks, onSelectTrack, activeTrackId }) {
  const [playingTrackId, setPlayingTrackId] = useState(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopTrackAudio();
      stopTrackPreview();
    };
  }, []);

  if (!sampleTracks || sampleTracks.length === 0) return null;

  const handleTogglePlay = (e, track) => {
    e.stopPropagation(); // Prevent triggering slider auto-fill click zone
    
    // Stop any existing background WAV audio or synth
    stopTrackAudio();
    stopTrackPreview();

    if (playingTrackId === track.id) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(track.id);
      // For AI Demo Track (unknown tune), play synth melody preview
      if (track.id === 'track_06' || !track.youtube_id) {
        playTrackPreview(track, () => setPlayingTrackId(null));
      }
    }
  };

  const handleYoutubeClick = (e, youtubeId) => {
    e.stopPropagation();
    openYoutubeLink(youtubeId);
  };

  return (
    <div id="sample-tracks" className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 mb-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Real Track Jukebox
              <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Hit Benchmarks
              </span>
            </h2>
            <p className="text-xs text-slate-400">Select any benchmark track to target it across the entire platform</p>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Approximate values — for demo purposes</span>
        </div>
      </div>

      {/* Real & AI Track Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {sampleTracks.map((track) => {
          const isActive = activeTrackId === track.id;
          const isPlaying = playingTrackId === track.id;

          const getLangColor = (lang) => {
            if (lang === 'Telugu') return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
            if (lang === 'Hindi') return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
            if (lang === 'AI Demo') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse';
            return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
          };

          const isAiTrack = track.id === 'track_06' || !track.youtube_id;

          return (
            <motion.div
              key={track.id}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => onSelectTrack(track)}
              className={`p-4 rounded-2xl text-left transition-all border relative flex flex-col justify-between cursor-pointer ${
                isActive 
                  ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/20 text-white' 
                  : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-gray-200'
              }`}
            >
              {/* Top Language Badge & Audio Preview Play Button */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getLangColor(track.language)}`}>
                  {track.flag} {track.language}
                </span>

                {/* Audio/Video Preview Trigger Button */}
                <button
                  onClick={(e) => handleTogglePlay(e, track)}
                  title={isAiTrack ? "Play AI Neural Audio Preview" : "Play YouTube Video in Same Panel"}
                  className={`p-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-[10px] font-bold ${
                    isPlaying 
                      ? (isAiTrack ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/50 animate-pulse' : 'bg-red-600 text-white shadow-lg shadow-red-500/50 animate-pulse')
                      : 'bg-white/10 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 border border-white/10'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Preview</span>
                    </>
                  )}
                </button>
              </div>

              {/* Track Name & Artist */}
              <div className="space-y-1 mb-3">
                <h3 className="font-bold text-sm text-white line-clamp-1 leading-snug">{track.track_name}</h3>
                <p className="text-[11px] text-gray-400 line-clamp-1">{track.artist}</p>
                <p className="text-[10px] text-gray-500 italic line-clamp-1">{track.movie_or_album}</p>
              </div>

              {/* Embedded Player: Embedded YouTube Video for Real Tracks OR AI Neural Spectrum for AI Track */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-3 overflow-hidden rounded-xl border border-emerald-500/40 bg-black/90 p-1 shadow-2xl"
                  >
                    {isAiTrack ? (
                      /* AI Neural Audio Spectrum Visualizer (For Unknown Tune Demo) */
                      <div className="p-2 space-y-1.5 bg-black/80 rounded-lg border border-emerald-500/30">
                        <div className="flex items-center justify-between text-[10px] text-emerald-300 font-mono">
                          <span className="flex items-center gap-1.5 font-bold">
                            <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                            AI Neural Tune
                          </span>
                          <span className="text-emerald-400 font-extrabold">{track.tempo} BPM</span>
                        </div>

                        {/* Spectrum Frequency Bars */}
                        <div className="flex items-end justify-center gap-1 h-7 pt-1">
                          {[50, 85, 60, 95, 40, 80, 65, 90, 50, 85, 70, 90].map((h, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full"
                              animate={{ height: [`${h * 0.25}%`, `${h}%`, `${h * 0.35}%`] }}
                              transition={{ duration: 0.7 + (i % 4) * 0.15, repeat: Infinity, repeatType: 'reverse' }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Embedded Real YouTube Video Player */
                      <iframe
                        width="100%"
                        height="140"
                        src={`https://www.youtube.com/embed/${track.youtube_id}?start=${track.preview_start_sec || 30}&end=${track.preview_end_sec || 48}&autoplay=1`}
                        title={`${track.track_name} YouTube Video`}
                        allow="autoplay; encrypted-media"
                        className="rounded-lg border-0 w-full"
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Audio Highlights Bar & External YouTube Link */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>{track.tempo} BPM</span>
                
                <button
                  onClick={(e) => handleYoutubeClick(e, track.youtube_id)}
                  title="Watch official video on YouTube"
                  className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 font-semibold transition"
                >
                  <span>YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
