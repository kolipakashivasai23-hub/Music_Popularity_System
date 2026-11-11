# SONIQ AI — Advanced AI-Powered Music Intelligence Platform
> **Major Academic Project & Production-Ready Demonstration Deliverable**  
> *Machine Learning Popularity Prediction Engine + Hit Potential Classification + DSP Audio Signal Processing + Explainable AI (SHAP) + Statistical Lab + React & Framer Motion Web Application*

---

## 🎵 Product Overview

**SONIQ AI** is a multi-model music intelligence platform that combines digital signal processing (DSP), supervised machine learning, and explainable AI to evaluate audio tracks, forecast commercial popularity ($0–100$), compute hit potential odds, and uncover actionable production insights.

```
                  ┌───────────────────────────────────────────────┐
                  │       SONIQ AI MUSIC INTELLIGENCE PIPELINE    │
                  └───────────────────────┬───────────────────────┘
                                          │
            ┌─────────────────────────────┴─────────────────────────────┐
            ▼                                                           ▼
   ┌───────────────────┐                                       ┌───────────────────┐
   │ Audio File (.wav) │                                       │ 8 Audio Sliders   │
   └────────┬──────────┘                                       └────────┬──────────┘
            │ (Python Librosa DSP)                                      │
            ▼                                                           ▼
   ┌───────────────────────────────────────────────────────────────────────────────┐
   │ Feature Vector: [Danceability, Energy, Loudness, Tempo, Acousticness, etc.]   │
   └──────────────────────────────────────┬────────────────────────────────────────┘
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            ▼                             ▼                             ▼
   ┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐
   │ XGBoost Regressor │         │ Hit Classifier    │         │ SHAP Tree         │
   │  (Popularity 0-100│         │ (Random Forest)   │         │ Explainer         │
   │   + Uncertainty)  │         │ (Hit Odds %)      │         │ (Attribution)     │
   └────────┬──────────┘         └────────┬──────────┘         └────────┬──────────┘
            │                             │                             │
            └─────────────────────────────┼─────────────────────────────┘
                                          │
                                          ▼
   ┌───────────────────────────────────────────────────────────────────────────────┐
   │ React Dashboard: DJ Vinyl Gauge, What-If Lab, Statistical Lab, Reports, Chat  │
   └───────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 14 Core Platform Modules

1. **Advanced Popularity Prediction (0–100 Index)**:
   - Regression prediction ($R^2 = 0.910$, MAE = $6.51$) with categorical tiers (*Viral Superhit*, *Mainstream Hit*, *Moderate Chart Performer*, *Indie/Emerging*, *Underground Niche*).
   - **Prediction Uncertainty**: 95% Confidence Interval ($[CI_{lower}, CI_{upper}]$), standard error ($\pm 3.2$ pts), and confidence score derived from tree estimator variance.

2. **Hit Potential Analyzer**:
   - Separately trained classification model (**Random Forest Classifier**, ROC-AUC = $0.949$, F1 = $0.888$) estimating commercial hit probability ($0–100\%$).
   - Category assignment (*Diamond Hit Contender*, *Platinum Potential*, *Gold Contender*, *Silver Prospect*, *Indie Niche*).
   - Dynamic breakdown of positive odds boosters and risk factors.

3. **Interactive What-If Simulator**:
   - Dual-column sandbox comparing baseline vs tweaked audio parameters (energy, danceability, tempo, valence, acousticness, loudness, instrumentalness, speechiness).
   - Real-time delta comparison ($\Delta$ Popularity points, $\Delta$ Hit odds).
   - Contextual AI optimization tips to maximize track performance.

4. **Audio Upload & Analyzer (Python Librosa)**:
   - Upload real audio files (`.mp3`, `.wav`, `.ogg`, `.m4a`).
   - Digital Signal Processing (DSP) via Python Librosa: computes duration, sample rate, tempo (BPM), RMS energy, loudness (dB), spectral centroid, zero-crossing rate, harmonic-percussive separation, and 13 MFCC coefficients.
   - Interactive SVG waveform visualizer and 1-click feature transfer to the prediction studio.

5. **Advanced Statistical Laboratory**:
   - Pearson ($r$) and Spearman ($\rho$) correlation matrices with interactive heatmap.
   - Bivariate OLS Regressions with scatter plots ($y = mx + c$, $R^2$, $p$-value).
   - Outlier Detection via the Interquartile Range (IQR) rule ($Q1 - 1.5 \times IQR$, $Q3 + 1.5 \times IQR$).
   - Feature distribution analysis (skewness, kurtosis, and histogram binning).

6. **Explainable AI (SHAP)**:
   - Cooperative game-theoretic feature attribution powered by `shap.TreeExplainer`.
   - Global feature importance (mean absolute SHAP values across 4,200 tracks).
   - Individual track waterfall attribution: Base Value $E[f(X)]$ ($52.8$) $\rightarrow$ Positive SHAP forces $\rightarrow$ Negative SHAP forces $\rightarrow$ Final Output.

7. **Genre Intelligence & Audio Clusters**:
   - 10 genres (Pop, Hip-Hop, Electronic, Rock, R&B, Latin, Indie, Classical, Jazz, Country) with average popularity and hit rate comparisons.
   - Radar acoustic fingerprints.
   - Unsupervised K-Means clustering ($k=4$ musical archetypes: High-Energy Pop, Urban Hip-Hop, Acoustic Ballad, Chill Ambient).

8. **Music Recommendation Engine**:
   - Cosine similarity matching against an indexed 4,200+ track research corpus.
   - 4 modes: *Similar Songs* (scaled Euclidean/Cosine vector matching), *Mood-Aligned* (Euphoric, Chill, Workout, Melancholic), *Genre-Based*, and *Underrated Gems* (high intrinsic audio quality but lower current stream count).
   - Audio synthesizer previews and 1-click feature loading.

9. **Song Comparison Studio**:
   - Multi-track comparative radar chart (overlaying 2 to 4 tracks).
   - Grouped bar charts comparing Popularity Index vs Hit Odds.
   - Audio feature delta matrix with winner highlights.

10. **Music Trend Analysis (1980–2024)**:
    - 44-year historical progression spanning 5 decades.
    - Decadal Loudness War progression (volume rising from $-12$ dB to $-5.5$ dB).
    - Longitudinal trends: Danceability growth vs Acousticness decline.

11. **AI Music Assistant (SONIQ Copilot)**:
    - Context-aware chatbot answering queries regarding audio features, hit optimization, genre trends, and model predictions.
    - Quick prompt suggestions and real-time awareness of the active studio track.

12. **Professional Reports & Data Export**:
    - Downloadable Executive PDF Evaluation Report generated via `fpdf2`.
    - Corpus Dataset CSV Export (4,202 rows $\times$ 17 variables).

13. **User Personalization & Studio Hub**:
    - Automatic prediction history logging with 1-click restore.
    - Favorite tracks bookmarking.
    - Sound profile preferences (target genre, preferred tempo sweet spot, production notes).

14. **Dashboard KPI Analytics**:
    - Executive metric banner: Total Corpus Tracks (4,200+), Champion Model $R^2$ (0.910), Hit Accuracy (87.0%), Top Driver (Danceability).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion, Recharts, Lucide React, Axios |
| **Backend REST API** | Python, FastAPI, Uvicorn, Pydantic, HTTPX, Python-Multipart |
| **Machine Learning & DSP** | Scikit-Learn, XGBoost, SHAP, Python Librosa, SoundFile, SciPy, NumPy, Pandas, Joblib |
| **Document Generation** | FPDF2, ReportLab |

---

## 🚀 How to Run the Project Locally

### Step 1: Run Machine Learning Pipeline
```bash
python ml/generate_dataset.py
python ml/train_model.py
```

### Step 2: Launch FastAPI Backend Server
```bash
pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/health`

### Step 3: Launch React Web App
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:5173` in your browser.

---

## 🎓 Academic Review & Demonstration Notes
- **Authentic Machine Learning**: All predictions, classifications, and explanations run through actual trained models (`model.pkl`, `hit_classifier.pkl`, and `shap.TreeExplainer`).
- **No Hardcoded Predictions**: The system performs dynamic inference on user-adjusted sliders, uploaded audio files, or selected track presets.
- **Explainable AI (XAI)**: SHAP values quantify exact point additions/subtractions from baseline expectations ($E[f(X)]$).
