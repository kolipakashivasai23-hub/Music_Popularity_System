import joblib, json, os
import numpy as np

model = joblib.load('backend/model.pkl')
scaler = joblib.load('backend/scaler.pkl')

with open('backend/sample_tracks.json', 'r', encoding='utf-8') as f:
    tracks = json.load(f)

FEATURE_ORDER = ['danceability', 'energy', 'loudness', 'tempo', 'acousticness', 'instrumentalness', 'speechiness', 'valence']

print('=== MODEL PREDICTIONS FOR SAMPLE TRACKS ===')
for t in tracks:
    vec = [t[f] for f in FEATURE_ORDER]
    vec_scaled = scaler.transform([vec])
    raw_pred = model.predict(vec_scaled)[0]
    score = int(round(np.clip(raw_pred, 0, 100)))
    print(f"{t['track_name']} ({t['artist']}) -> Predicted Popularity: {score}/100 (Raw: {raw_pred:.2f})")
