import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import ActiveSongBar, { ALL_SONG_PRESETS } from './components/ActiveSongBar';
import Header from './components/Header';
import SampleTracksPanel from './components/SampleTracksPanel';
import FlowPanel from './components/FlowPanel';
import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import InsightsSection from './components/InsightsSection';
import HitPotentialPanel from './components/HitPotentialPanel';
import WhatIfSimulator from './components/WhatIfSimulator';
import AudioAnalyzerPanel from './components/AudioAnalyzerPanel';
import StatisticalLabPanel from './components/StatisticalLabPanel';
import ExplainableAiPanel from './components/ExplainableAiPanel';
import GenreIntelligencePanel from './components/GenreIntelligencePanel';
import SongComparisonPanel from './components/SongComparisonPanel';
import TrendAnalysisPanel from './components/TrendAnalysisPanel';
import RecommendationEnginePanel from './components/RecommendationEnginePanel';
import ReportsExportPanel from './components/ReportsExportPanel';
import PersonalizationPanel from './components/PersonalizationPanel';
import AiAssistantDrawer from './components/AiAssistantDrawer';
import EqualizerLoader from './components/EqualizerLoader';
import PresetButtons, { PRESETS } from './components/PresetButtons';
import { predictPopularity, getInsights, getSampleTracks } from './services/api';
import { savePredictionToHistory } from './utils/storage';
import { Music, Bot, Menu, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('predictor');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Initialize with the first real hit song preset (Tum Hi Ho)
  const defaultTrack = ALL_SONG_PRESETS[0];
  const [features, setFeatures] = useState({
    danceability: defaultTrack.danceability,
    energy: defaultTrack.energy,
    loudness: defaultTrack.loudness,
    tempo: defaultTrack.tempo,
    acousticness: defaultTrack.acousticness,
    instrumentalness: defaultTrack.instrumentalness,
    speechiness: defaultTrack.speechiness,
    valence: defaultTrack.valence
  });
  const [activePreset, setActivePreset] = useState(null);
  const [activeTrackId, setActiveTrackId] = useState(defaultTrack.id);
  const [activeTrackName, setActiveTrackName] = useState(defaultTrack.track_name);
  const [activeArtistName, setActiveArtistName] = useState(defaultTrack.artist_name);

  // Prediction, Insights, and Sample Tracks states
  const [result, setResult] = useState(null);
  const [insights, setInsights] = useState(null);
  const [sampleTracks, setSampleTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [triggerTimestamp, setTriggerTimestamp] = useState(1);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Load backend insights and sample tracks on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [insightsData, tracksData] = await Promise.all([
          getInsights(),
          getSampleTracks()
        ]);
        setInsights(insightsData);
        setSampleTracks(tracksData);
      } catch (err) {
        console.warn('Could not load initial backend data:', err);
      }
    };
    fetchInitialData();

    // Trigger initial prediction for default track
    handlePredict(
      {
        danceability: defaultTrack.danceability,
        energy: defaultTrack.energy,
        loudness: defaultTrack.loudness,
        tempo: defaultTrack.tempo,
        acousticness: defaultTrack.acousticness,
        instrumentalness: defaultTrack.instrumentalness,
        speechiness: defaultTrack.speechiness,
        valence: defaultTrack.valence
      },
      defaultTrack.track_name,
      defaultTrack.artist_name
    );
  }, []);

  const handleFeatureChange = (key, value) => {
    setFeatures(prev => ({
      ...prev,
      [key]: value
    }));
    setActivePreset(null);
    setActiveTrackId('custom_edit');
  };

  const handleSelectPreset = (preset) => {
    setFeatures(preset.features);
    setActivePreset(preset.name);
    setActiveTrackId(null);
    setActiveTrackName(preset.name);
    setActiveArtistName('Genre Archetype');
    handlePredict(preset.features, preset.name, 'Genre Archetype');
  };

  const handleSelectSongPreset = (song) => {
    const songFeatures = {
      danceability: song.danceability,
      energy: song.energy,
      loudness: song.loudness,
      tempo: song.tempo,
      acousticness: song.acousticness,
      instrumentalness: song.instrumentalness,
      speechiness: song.speechiness,
      valence: song.valence
    };
    setFeatures(songFeatures);
    setActiveTrackId(song.id);
    setActiveTrackName(song.track_name);
    setActiveArtistName(song.artist_name || song.artist || 'Studio Artist');
    handlePredict(songFeatures, song.track_name, song.artist_name || song.artist);
  };

  const handleSelectTrack = (track) => {
    const trackFeatures = {
      danceability: track.danceability,
      energy: track.energy,
      loudness: track.loudness,
      tempo: track.tempo,
      acousticness: track.acousticness,
      instrumentalness: track.instrumentalness,
      speechiness: track.speechiness,
      valence: track.valence
    };
    setFeatures(trackFeatures);
    setActiveTrackId(track.id || track.track_id);
    setActivePreset(null);
    setActiveTrackName(track.track_name || 'Selected Track');
    setActiveArtistName(track.artist || track.artist_name || 'Studio Artist');
    handlePredict(trackFeatures, track.track_name, track.artist || track.artist_name);
    setActiveTab('predictor');
  };

  const handlePredict = async (
    featuresToPredict = features, 
    trackName = activeTrackName, 
    artistName = activeArtistName
  ) => {
    setIsLoading(true);
    setError(null);
    setTriggerTimestamp(prev => prev + 1);
    try {
      const res = await predictPopularity(featuresToPredict);
      setResult(res);

      savePredictionToHistory({
        track_name: trackName,
        features: featuresToPredict,
        result: res
      });
    } catch (err) {
      console.error('Prediction failed:', err);
      setError('Failed to compute popularity prediction. Please check if the SONIQ AI backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyExtractedAudio = (extracted) => {
    setFeatures(extracted);
    setActivePreset(null);
    setActiveTrackId('uploaded_file');
    setActiveTrackName('Uploaded Audio File');
    setActiveArtistName('Librosa Extracted');
    handlePredict(extracted, 'Uploaded Audio File', 'Librosa Extracted');
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-cyan-500 selection:text-black">
      {/* Mobile Top Header with Hamburger */}
      <div className="md:hidden p-4 bg-[#0B0E14] border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
            <Music className="w-4 h-4" />
          </div>
          <span className="font-black text-white text-base">
            SONIQ<span className="text-cyan-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4" />
            <span>Copilot</span>
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Vertical Left Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen shrink-0">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          activeTrackName={activeTrackName}
          activeArtistName={activeArtistName}
          currentScore={result?.predicted_popularity}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />
      </div>

      {/* Mobile Slide-Out Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-[#0B0E14] border-r border-slate-800 z-10 flex flex-col">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={(t) => {
                setActiveTab(t);
                setIsMobileSidebarOpen(false);
              }} 
              activeTrackName={activeTrackName}
              activeArtistName={activeArtistName}
              currentScore={result?.predicted_popularity}
              onOpenAssistant={() => {
                setIsMobileSidebarOpen(false);
                setIsAssistantOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Global Active Song Selector Banner */}
          <ActiveSongBar
            activeTrackName={activeTrackName}
            activeArtistName={activeArtistName}
            features={features}
            result={result}
            onSelectSong={handleSelectSongPreset}
            onNavigateTab={setActiveTab}
          />

          {/* Error Alert Display */}
          {error && <EqualizerLoader error={error} onRetry={() => handlePredict()} />}

          {/* Tabbed View Panels */}
          <AnimatePresence mode="wait">
            {/* TAB 1: STUDIO PREDICTOR & TURNTABLE RESULT */}
            {activeTab === 'predictor' && (
              <motion.div
                key="predictor-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Header />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Input Sliders & Real Track Presets */}
                  <div className="lg:col-span-7 space-y-6">
                    <PresetButtons 
                      onSelectPreset={handleSelectPreset} 
                      activePreset={activePreset} 
                    />

                    <InputPanel
                      features={features}
                      onChangeFeature={handleFeatureChange}
                      sampleTracks={sampleTracks}
                      onSelectTrack={handleSelectTrack}
                      activeTrackId={activeTrackId}
                      onPredict={() => handlePredict()}
                      isLoading={isLoading}
                    />
                  </div>

                  {/* Right Column: Redesigned DJ Vinyl Turntable Result Panel */}
                  <div className="lg:col-span-5 space-y-6">
                    {isLoading ? (
                      <EqualizerLoader />
                    ) : (
                      <ResultPanel 
                        result={result} 
                        features={features}
                        trackName={activeTrackName}
                        artistName={activeArtistName}
                        onNavigateTab={setActiveTab}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: HIT POTENTIAL ANALYZER FOR THIS PARTICULAR SONG */}
            {activeTab === 'hit_analyzer' && (
              <motion.div
                key="hit-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <HitPotentialPanel 
                  features={features}
                  trackName={activeTrackName}
                  artistName={activeArtistName}
                  onNavigateTab={setActiveTab}
                />
              </motion.div>
            )}

            {/* TAB 3: WHAT-IF SIMULATOR FOR THIS PARTICULAR SONG */}
            {activeTab === 'what_if' && (
              <motion.div
                key="whatif-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <WhatIfSimulator 
                  baselineFeatures={features}
                  trackName={activeTrackName}
                  artistName={activeArtistName}
                  onApplyModified={(modified) => {
                    setFeatures(modified);
                    handlePredict(modified);
                    setActiveTab('predictor');
                  }}
                />
              </motion.div>
            )}

            {/* TAB 4: AUDIO LAB (LIBROSA DSP) */}
            {activeTab === 'audio_lab' && (
              <motion.div
                key="audio-lab-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AudioAnalyzerPanel 
                  onApplyExtractedFeatures={handleApplyExtractedAudio}
                  onNavigateTab={setActiveTab}
                />
              </motion.div>
            )}

            {/* TAB 5: STATISTICAL LABORATORY */}
            {activeTab === 'stats_lab' && (
              <motion.div
                key="stats-lab-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <StatisticalLabPanel />
              </motion.div>
            )}

            {/* TAB 6: EXPLAINABLE AI (SHAP) FOR THIS PARTICULAR SONG */}
            {activeTab === 'xai' && (
              <motion.div
                key="xai-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ExplainableAiPanel 
                  result={result}
                  features={features}
                  trackName={activeTrackName}
                  artistName={activeArtistName}
                />
              </motion.div>
            )}

            {/* TAB 7: GENRE INTELLIGENCE */}
            {activeTab === 'genres' && (
              <motion.div
                key="genres-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <GenreIntelligencePanel />
              </motion.div>
            )}

            {/* TAB 8: SONG COMPARISON STUDIO */}
            {activeTab === 'compare' && (
              <motion.div
                key="compare-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SongComparisonPanel 
                  activeTrackName={activeTrackName}
                  activeArtistName={activeArtistName}
                  activeFeatures={features}
                  sampleTracks={sampleTracks}
                />
              </motion.div>
            )}

            {/* TAB 9: MUSIC TREND ANALYSIS */}
            {activeTab === 'trends' && (
              <motion.div
                key="trends-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TrendAnalysisPanel />
              </motion.div>
            )}

            {/* TAB 10: RECOMMENDATION ENGINE FOR THIS PARTICULAR SONG */}
            {activeTab === 'recommendations' && (
              <motion.div
                key="recs-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <RecommendationEnginePanel 
                  currentFeatures={features}
                  trackName={activeTrackName}
                  artistName={activeArtistName}
                  onSelectTrackForPredictor={handleSelectTrack}
                />
              </motion.div>
            )}

            {/* TAB: MODEL ANALYTICS & EDA (PRESERVED) */}
            {activeTab === 'insights' && (
              <motion.div
                key="insights-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <InsightsSection insights={insights} />
              </motion.div>
            )}

            {/* TAB 11: REAL TRACK JUKEBOX PANEL (PRESERVED) */}
            {activeTab === 'jukebox' && (
              <motion.div
                key="jukebox-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <SampleTracksPanel
                  sampleTracks={sampleTracks}
                  onSelectTrack={handleSelectTrack}
                  activeTrackId={activeTrackId}
                />
              </motion.div>
            )}

            {/* TAB 12: LIVE PROCESS FLOW PANEL ("HOW IT WORKS") (PRESERVED) */}
            {activeTab === 'flow' && (
              <motion.div
                key="flow-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <FlowPanel
                  result={result}
                  features={features}
                  insights={insights}
                  triggerTimestamp={triggerTimestamp}
                />
              </motion.div>
            )}

            {/* TAB 13: PROFESSIONAL REPORTS & EXPORT */}
            {activeTab === 'reports' && (
              <motion.div
                key="reports-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ReportsExportPanel 
                  currentFeatures={features}
                  currentResult={result}
                  activeTrackName={activeTrackName}
                  activeArtistName={activeArtistName}
                />
              </motion.div>
            )}

            {/* TAB 14: PERSONALIZATION HUB & HISTORY */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PersonalizationPanel 
                  onRestoreFeatures={(restored) => {
                    setFeatures(restored);
                    handlePredict(restored);
                  }}
                  onNavigateTab={setActiveTab}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Product Footer */}
        <footer className="py-8 text-center text-xs text-slate-500 border-t border-slate-800/80 bg-[#070A11]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">
                SONIQ<span className="text-cyan-400">AI</span>
              </span>
              <span>— Music Intelligence & Popularity Platform</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Multi-Model ML: XGBoost • Random Forest • Librosa DSP • SHAP XAI
            </p>
          </div>
        </footer>
      </div>

      {/* Floating AI Assistant Copilot Drawer */}
      <AiAssistantDrawer 
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentFeatures={features}
        currentPrediction={result}
      />
    </div>
  );
}
