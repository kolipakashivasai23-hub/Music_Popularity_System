import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Table, CheckCircle2, ShieldCheck, 
  Sparkles, FileSpreadsheet, ArrowRight 
} from 'lucide-react';
import { downloadPdfReport, exportDatasetCsv } from '../services/api';

export default function ReportsExportPanel({ currentFeatures, currentResult, activeTrackName, activeArtistName }) {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isCsvLoading, setIsCsvLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    setDownloadSuccess(null);
    try {
      await downloadPdfReport({
        track_name: activeTrackName || "Studio Session Track",
        artist_name: activeArtistName || "SONIQ AI Producer",
        features: currentFeatures,
        prediction: currentResult,
        hit_potential: currentResult?.hit_potential
      });
      setDownloadSuccess("PDF Executive Report successfully generated & downloaded!");
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleDownloadCsv = async () => {
    setIsCsvLoading(true);
    setDownloadSuccess(null);
    try {
      await exportDatasetCsv();
      setDownloadSuccess("Dataset CSV successfully exported!");
    } catch (e) {
      console.error("CSV export failed:", e);
    } finally {
      setIsCsvLoading(false);
    }
  };

  return (
    <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Reports & Dataset Export</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                PDF & CSV Engines
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Export downloadable evaluation sheets and raw 4,200-row research dataset CSVs
            </p>
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Dual Cards for PDF & CSV */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* PDF Card */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Executive PDF Report</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Contains a formal evaluation sheet complete with audio feature breakdown, 
              confidence intervals, hit potential tier, and tactical production recommendations.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Track Title:</span>
              <strong className="text-white font-sans">{activeTrackName || "Studio Session Track"}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Current Score:</span>
              <strong className="text-cyan-400">{currentResult?.predicted_popularity || 85}/100</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Hit Probability:</span>
              <strong className="text-emerald-400">{currentResult?.hit_potential?.hit_percentage || 88}%</strong>
            </div>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={isPdfLoading}
            className="w-full py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isPdfLoading ? "Building PDF Report..." : "Download Official PDF"}</span>
          </button>
        </div>

        {/* CSV Card */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Corpus Dataset Export (CSV)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download the entire 4,200+ track research dataset including track metadata, genres, 
              release years (1980–2024), 8 audio dimensions, and target popularity labels.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>File Name:</span>
              <strong className="text-white">spotify_tracks.csv</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Rows Count:</span>
              <strong className="text-purple-300">4,202 samples</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Variables:</span>
              <strong className="text-purple-300">17 audio & meta columns</strong>
            </div>
          </div>

          <button
            onClick={handleDownloadCsv}
            disabled={isCsvLoading}
            className="w-full py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isCsvLoading ? "Exporting CSV..." : "Export Complete Dataset (CSV)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

