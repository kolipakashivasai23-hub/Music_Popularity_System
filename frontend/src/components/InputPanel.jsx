import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sliders, Info, Sparkles, Activity, Radio, Volume2, VolumeX, Music as MusicIcon,
  Music, Zap, Volume2 as VolIcon, Clock, Radio as RadioIcon, Headphones, Mic, Smile, ExternalLink, Cpu
} from 'lucide-react';
import { playTrackAudio, stopTrackAudio, openYoutubeLink } from '../utils/audioPlayer';
import { playTrackPreview, stopTrackPreview } from '../utils/audioSynth';

export const FEATURE_METADATA = [
  {
    key: 'danceability',
    label: 'Danceability',
    icon: Music,
    min: 0.0,
    mid: 0.50,
    max: 1.0,
    step: 0.01,
    decimals: 2,
    unit: '',
    ticks: ['0.00 (Low)', '0.50 (Mid)', '1.00 (High)'],
    description: 'Rhythmic stability, beat strength, and overall dance suitability.',
    color: 'from-emerald-500 to-teal-400'
  },
  {
    key: 'energy',
    label: 'Energy',
    icon: Zap,
    min: 0.0,
    mid: 0.50,
    max: 1.0,
    step: 0.01,
    decimals: 2,
    unit: '',
    ticks: ['0.00 (Calm)', '0.50 (Moderate)', '1.00 (Intense)'],
    description: 'Perceptual measure of intensity, activity, noise, and loudness.',
    color: 'from-purple-500 to-indigo-400'
  },
  {
    key: 'loudness',
    label: 'Loudness',
    icon: VolIcon,
    min: -30.0,
    mid: -15.0,
    max: 0.0,
    step: 0.5,
    decimals: 1,
    unit: ' dB',
    ticks: ['-30 dB (Soft)', '-15 dB (Standard)', '0 dB (Loud)'],
    description: 'Overall loudness of a track in decibels (dB). Range: -30 dB to 0 dB.',
    color: 'from-pink-500 to-rose-400'
  },
  {
    key: 'tempo',
    label: 'Tempo',
    icon: Clock,
    min: 50.0,
    mid: 135.0,
    max: 220.0,
    step: 1.0,
    decimals: 0,
    unit: ' BPM',
    ticks: ['50 BPM (Slow)', '135 BPM (Pop/Dance)', '220 BPM (Fast)'],
    description: 'Pace of track in Beats Per Minute (BPM). Modern pop sits at 110–130 BPM.',
    color: 'from-cyan-500 to-blue-400'
  },
  {
    key: 'acousticness',
    label: 'Acousticness',
    icon: RadioIcon,
    min: 0.0,
    mid: 0.50,
    max: 1.0,
    step: 0.01,
    decimals: 2,
    unit: '',
    ticks: ['0.00 (Electric)', '0.50 (Hybrid)', '1.00 (Unplugged)'],
    description: 'Confidence score whether the track is acoustic (unplugged instruments).',
    color: 'from-amber-500 to-orange-400'
  },
  {
    key: 'instrumentalness',
    label: 'Instrumentalness',
    icon: Headphones,
    min: 0.0,
    mid: 0.50,
    max: 1.0,
    step: 0.01,
    decimals: 2,
    unit: '',
    ticks: ['0.00 (Vocal)', '0.50 (Partial)', '1.00 (Instrumental)'],
    description: 'Predicts whether a track contains no vocals ("Ooh" & "aah" count as instrumental).',
    color: 'from-violet-500 to-purple-400'
  },
  {
    key: 'speechiness',
    label: 'Speechiness',
    icon: Mic,
    min: 0.0,
    mid: 0.50,
    max: 1.0,
    step: 0.01,
    decimals: 2,
    unit: '',
    ticks: ['0.00 (Music)', '0.50 (Rap/Speech)', '1.00 (Spoken Word)'],
    description: 'Presence of spoken words (Rap/Hip-hop > 0.33, Podcasts > 0.66).',
    color: 'from-sky-500 to-indigo-400'
  },
  {
    key: 'valence',
    label: 'Valence (Positivity)',
    icon: Smile,
    min: 0.0,
    mid: 0.50,
    max: 1.0,
    step: 0.01,
    decimals: 2,
    unit: '',
    ticks: ['0.00 (Sad/Melancholy)', '0.50 (Neutral)', '1.00 (Happy/Euphoric)'],
    description: 'Musical positiveness (high = happy/cheerful, low = sad/depressing).',
    color: 'from-emerald-400 to-lime-400'
  }
];

export default function InputPanel({ 
  features, 
  onChangeFeature, 
  sampleTracks = [],
  onSelectTrack, 
  activeTrackId,
  onPredict, 
  isLoading 
}) {
  const [playingTrackId, setPlayingTrackId] = useState(null);

  useEffect(() => {
    return () => {
      stopTrackAudio();
      stopTrackPreview();
    };
  }, []);

  const handleTogglePlay = (e, track) => {
    e.stopPropagation();
    
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

  // 10 Songs Dataset for Dropdown Selector
  const DROPDOWN_SONGS = [
    {
      id: "track_01",
      name: "🇮🇳 Tum Hi Ho — Arijit Singh (Aashiqui 2)",
      track_name: "Tum Hi Ho",
      artist: "Arijit Singh, Mithoon",
      youtube_id: "IJq0yyWug1k",
      danceability: 0.76, energy: 0.78, loudness: -5.2, tempo: 95.0, acousticness: 0.18, instrumentalness: 0.00, speechiness: 0.04, valence: 0.74
    },
    {
      id: "track_02",
      name: "🇮🇳 Raataan Lambiyan — Jubin Nautiyal (Shershaah)",
      track_name: "Raataan Lambiyan",
      artist: "Jubin Nautiyal, Asees Kaur",
      youtube_id: "gvyUuxdRdR4",
      danceability: 0.80, energy: 0.82, loudness: -4.8, tempo: 102.0, acousticness: 0.15, instrumentalness: 0.00, speechiness: 0.05, valence: 0.80
    },
    {
      id: "track_03",
      name: "🇮🇳 Kesariya — Arijit Singh (Brahmastra)",
      track_name: "Kesariya",
      artist: "Arijit Singh, Pritam",
      youtube_id: "BddP6PYo2gs",
      danceability: 0.78, energy: 0.80, loudness: -5.0, tempo: 98.0, acousticness: 0.20, instrumentalness: 0.00, speechiness: 0.04, valence: 0.76
    },
    {
      id: "track_04",
      name: "🌐 Shape of You — Ed Sheeran (Divide)",
      track_name: "Shape of You",
      artist: "Ed Sheeran",
      youtube_id: "JGwWNGJdvx8",
      danceability: 0.85, energy: 0.82, loudness: -3.8, tempo: 96.0, acousticness: 0.22, instrumentalness: 0.00, speechiness: 0.08, valence: 0.91
    },
    {
      id: "track_05",
      name: "🌐 Blinding Lights — The Weeknd (After Hours)",
      track_name: "Blinding Lights",
      artist: "The Weeknd",
      youtube_id: "4NRXx6U8ABQ",
      danceability: 0.75, energy: 0.88, loudness: -4.5, tempo: 171.0, acousticness: 0.00, instrumentalness: 0.00, speechiness: 0.06, valence: 0.75
    },
    {
      id: "track_06",
      name: "🤖 AI Generated Track (Unknown Tune — Demo for Ma'am)",
      track_name: "AI Generated Track (Unknown Tune)",
      artist: "SymphonyAI Neural Generator",
      youtube_id: "",
      danceability: 0.88, energy: 0.91, loudness: -3.2, tempo: 128.0, acousticness: 0.05, instrumentalness: 0.00, speechiness: 0.06, valence: 0.85
    },
    {
      id: "preset_edm",
      name: "⚡ High Energy EDM Banger (Preset)",
      track_name: "High Energy EDM Banger",
      artist: "Synth Producer",
      youtube_id: "",
      danceability: 0.92, energy: 0.95, loudness: -2.5, tempo: 130.0, acousticness: 0.02, instrumentalness: 0.45, speechiness: 0.07, valence: 0.88
    },
    {
      id: "preset_dance",
      name: "💃 Dance Floor Anthem (Preset)",
      track_name: "Dance Floor Anthem",
      artist: "Club DJ Collective",
      youtube_id: "",
      danceability: 0.86, energy: 0.88, loudness: -4.0, tempo: 124.0, acousticness: 0.10, instrumentalness: 0.00, speechiness: 0.05, valence: 0.90
    },
    {
      id: "preset_acoustic",
      name: "🎹 Acoustic Guitar Unplugged (Preset)",
      track_name: "Acoustic Unplugged Session",
      artist: "Indie Soloist",
      youtube_id: "",
      danceability: 0.45, energy: 0.35, loudness: -12.0, tempo: 85.0, acousticness: 0.85, instrumentalness: 0.05, speechiness: 0.03, valence: 0.42
    },
    {
      id: "preset_vocal",
      name: "🎙️ Slow Soul Vocal Ballad (Preset)",
      track_name: "Soulful Vocal Ballad",
      artist: "Jazz Ensemble",
      youtube_id: "",
      danceability: 0.38, energy: 0.28, loudness: -14.5, tempo: 72.0, acousticness: 0.72, instrumentalness: 0.00, speechiness: 0.04, valence: 0.25
    }
  ];

  const handleDropdownSelect = (e) => {
    const selectedId = e.target.value;
    const found = DROPDOWN_SONGS.find(s => s.id === selectedId);
    if (found) {
      onSelectTrack(found);
    }
  };

  return (
    <div id="predict" className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Audio Feature Inputs</h2>
            <p className="text-xs text-gray-400">Select a song from dropdown or adjust sliders manually</p>
          </div>
        </div>

        {/* 10-Song Dropdown Selector */}
        <div className="w-full sm:w-auto min-w-[280px]">
          <label className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
            🎵 Quick Select Song (10 Tracks)
          </label>
          <select
            value={activeTrackId || ''}
            onChange={handleDropdownSelect}
            className="w-full px-3.5 py-2 rounded-xl bg-black/80 border border-emerald-500/40 text-white text-xs font-semibold focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <option value="" disabled>-- Select a Song to Auto-Fill Sliders --</option>
            {DROPDOWN_SONGS.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#0B0E14] text-white py-1">
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 6 Real Track & AI Preset Cards Bar */}
      {sampleTracks && sampleTracks.length > 0 && (
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              Hit Songs & AI Demo Tracks
            </span>
            <span className="text-[11px] text-gray-400">Click card to auto-fill sliders</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
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
                <div
                  key={track.id}
                  onClick={() => onSelectTrack(track)}
                  className={`p-3 rounded-2xl text-left transition-all border relative flex flex-col justify-between cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/20 text-white' 
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border ${getLangColor(track.language)}`}>
                      {track.flag} {track.language}
                    </span>

                    {/* Preview Trigger Button */}
                    <button
                      onClick={(e) => handleTogglePlay(e, track)}
                      title={isAiTrack ? "Play AI Neural Audio Preview" : "Play YouTube Video in Same Panel"}
                      className={`p-1.5 rounded-lg text-[9px] font-bold transition cursor-pointer flex items-center gap-1 ${
                        isPlaying 
                          ? (isAiTrack ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/50 animate-pulse' : 'bg-red-600 text-white shadow-lg shadow-red-500/50 animate-pulse')
                          : 'bg-white/10 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 border border-white/10'
                      }`}
                    >
                      {isPlaying ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                    </button>
                  </div>

                  <div className="space-y-0.5 mb-2">
                    <h3 className="font-bold text-xs text-white line-clamp-1 leading-snug">{track.track_name}</h3>
                    <p className="text-[10px] text-gray-400 line-clamp-1">{track.artist}</p>
                  </div>

                  {/* Player Banner: Embedded YouTube Video for Real Tracks OR AI Neural Spectrum for AI Track */}
                  <AnimatePresence>
                    {isPlaying && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-2 overflow-hidden rounded-xl border border-emerald-500/40 bg-black/90 p-1 shadow-2xl"
                      >
                        {isAiTrack ? (
                          /* AI Neural Audio Spectrum Visualizer (For Unknown Tune Demo) */
                          <div className="p-2 space-y-1.5 bg-black/80 rounded-lg border border-emerald-500/30">
                            <div className="flex items-center justify-between text-[9px] text-emerald-300 font-mono">
                              <span className="flex items-center gap-1 font-bold">
                                <Cpu className="w-3 h-3 text-emerald-400 animate-spin" />
                                AI Neural Tune
                              </span>
                              <span className="text-emerald-400 font-extrabold">{track.tempo} BPM</span>
                            </div>

                            {/* Spectrum Frequency Bars */}
                            <div className="flex items-end justify-center gap-0.5 h-6 pt-0.5">
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
                            height="120"
                            src={`https://www.youtube.com/embed/${track.youtube_id}?start=${track.preview_start_sec || 30}&end=${track.preview_end_sec || 48}&autoplay=1`}
                            title={`${track.track_name} preview`}
                            allow="autoplay; encrypted-media"
                            className="rounded-lg border-0 w-full"
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-gray-400">
                    <span>{track.tempo} BPM</span>
                    <span className="text-emerald-400 font-bold">Energy {track.energy}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feature Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {FEATURE_METADATA.map((meta) => {
          const Icon = meta.icon;
          const rawVal = features[meta.key];
          const formattedVal = typeof rawVal === 'number' ? rawVal.toFixed(meta.decimals) : rawVal;

          return (
            <div key={meta.key} className="space-y-2.5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition">
              {/* Header with Title, Icon and Prominent Numeric Value */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-200 text-sm flex items-center gap-2">
                  <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {meta.label}: <span className="text-emerald-400">{formattedVal}{meta.unit}</span>
                </span>
                <span className="font-mono text-xs text-emerald-400 font-extrabold bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30 shadow-inner">
                  {formattedVal}{meta.unit}
                </span>
              </div>

              {/* Range Slider */}
              <div className="relative pt-1 pb-1">
                <input
                  type="range"
                  min={meta.min}
                  max={meta.max}
                  step={meta.step}
                  value={rawVal}
                  onChange={(e) => onChangeFeature(meta.key, parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />

                {/* Visible Tick Marks & Scale Labels */}
                <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1 px-0.5">
                  <span className="flex flex-col items-start">
                    <span className="w-0.5 h-1.5 bg-gray-600 mb-0.5"></span>
                    <span>{meta.ticks[0]}</span>
                  </span>
                  <span className="flex flex-col items-center text-gray-500">
                    <span className="w-0.5 h-1.5 bg-gray-600 mb-0.5"></span>
                    <span>{meta.ticks[1]}</span>
                  </span>
                  <span className="flex flex-col items-end text-gray-400">
                    <span className="w-0.5 h-1.5 bg-gray-600 mb-0.5"></span>
                    <span>{meta.ticks[2]}</span>
                  </span>
                </div>
              </div>

              {/* Helper Description */}
              <div className="flex items-start gap-1.5 text-[11px] text-gray-400 pt-1 border-t border-white/5">
                <Info className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
                <span>{meta.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Predict Action Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPredict}
        disabled={isLoading}
        className="w-full py-4 rounded-2xl font-bold text-base text-black btn-glow-green flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Activity className="w-5 h-5 animate-spin text-black" />
            <span>Evaluating Audio Model...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-black" />
            <span>Predict Track Popularity</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
