import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  UploadCloud, FileAudio, Play, Pause, Activity, Zap, Volume2, Clock, 
  CheckCircle2, ArrowRight, Sparkles, BarChart2, Radio 
} from 'lucide-react';
import { analyzeAudioFile } from '../services/api';

export default function AudioAnalyzerPanel({ onApplyExtractedFeatures, onNavigateTab }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage(null);
      processAudioUpload(file);
    }
  };

  const processAudioUpload = async (file) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const data = await analyzeAudioFile(file);
      setAnalysisResult(data);
    } catch (err) {
      console.error("Audio analysis failed:", err);
      setErrorMessage("Could not analyze audio file. Ensure it is a valid MP3, WAV, or OGG format.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      processAudioUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const features = analysisResult?.extracted_features;
  const pred = analysisResult?.prediction;

  return (
    <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Audio Upload & Librosa Signal Analyzer</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                DSP & Python Librosa
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Extract real acoustic features from MP3/WAV files and compute ML popularity directly from raw audio
            </p>
          </div>
        </div>

        {features && (
          <button
            onClick={() => {
              if (onApplyExtractedFeatures) onApplyExtractedFeatures(features);
              if (onNavigateTab) onNavigateTab('predictor');
            }}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Apply to Studio Predictor</span>
          </button>
        )}
      </div>

      {/* Upload Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 sm:p-10 rounded-2xl border-2 border-dashed transition cursor-pointer text-center relative overflow-hidden ${
          isAnalyzing 
            ? 'border-cyan-500/60 bg-cyan-500/[0.05]' 
            : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <UploadCloud className={`w-7 h-7 ${isAnalyzing ? 'animate-bounce' : ''}`} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              {selectedFile ? selectedFile.name : "Click or Drag Audio Track Here"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports .mp3, .wav, .ogg, .m4a (Librosa extracts tempo, RMS energy, loudness & MFCCs)
            </p>
          </div>

          {isAnalyzing && (
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 animate-pulse pt-2">
              <Activity className="w-4 h-4 animate-spin" />
              <span>Analyzing audio spectrum with Python Librosa...</span>
            </div>
          )}

          {errorMessage && (
            <p className="text-xs text-rose-400 font-medium pt-1">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Waveform Visualizer */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Acoustic Amplitude Waveform ({analysisResult.duration_seconds}s @ {analysisResult.sample_rate} Hz)
              </span>
              <span className="font-mono text-cyan-400 text-xs">120 Downsampled Bins</span>
            </div>

            {/* SVG Waveform Rendering */}
            <div className="h-20 w-full flex items-center justify-between gap-1 px-2 overflow-hidden">
              {analysisResult.waveform?.map((heightRatio, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-cyan-400"
                  style={{
                    height: `${Math.max(6, heightRatio * 100)}%`,
                    opacity: 0.35 + (heightRatio * 0.65)
                  }}
                />
              ))}
            </div>
          </div>

          {/* Extracted Features Readout & Immediate ML Prediction */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* 8 Extracted Features */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(features || {}).map(([key, val]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                    {key}
                  </span>
                  <span className="text-base font-bold font-mono text-cyan-400 block">
                    {key === 'loudness' ? `${val} dB` : key === 'tempo' ? `${val} BPM` : val}
                  </span>
                </div>
              ))}
            </div>

            {/* Immediate Prediction Result Card */}
            {pred && (
              <div className="lg:col-span-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Model Popularity Output
                </span>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono text-white">
                    {pred.predicted_popularity}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>

                <span className="text-xs font-semibold text-emerald-400 block">
                  {pred.popularity_tier?.tier || "Viral Superhit"}
                </span>

                <p className="text-xs text-slate-300 leading-relaxed">
                  "{pred.interpretation}"
                </p>

                <button
                  onClick={() => {
                    if (onApplyExtractedFeatures) onApplyExtractedFeatures(features);
                    if (onNavigateTab) onNavigateTab('predictor');
                  }}
                  className="w-full py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer mt-2"
                >
                  <span>Explore in DJ Vinyl Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 13 MFCC Coefficients Footprint */}
          {analysisResult.mfcc_coefficients && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                13 Mel-Frequency Cepstral Coefficients (MFCC Spectrum Footprint)
              </span>

              <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-13 gap-2">
                {analysisResult.mfcc_coefficients.map((mfcc, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono">
                    <span className="text-[9px] text-slate-400 block">C{idx+1}</span>
                    <span className="text-xs font-semibold text-white">{mfcc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

