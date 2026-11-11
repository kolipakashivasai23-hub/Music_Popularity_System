"""
SONIQ AI — Spotify Audio Tracks Dataset Generator
=================================================
Generates a realistic, comprehensive music intelligence dataset with 4,000+ tracks.
Preserves existing audio feature definitions while adding realistic genres, release years
(1980–2024), track and artist metadata, and classification targets for Hit Potential modeling.
"""

import os
import random
import numpy as np
import pandas as pd

GENRES = [
    "Pop", "Hip-Hop", "Electronic", "Rock", "R&B", 
    "Latin", "Indie", "Classical", "Jazz", "Country"
]

GENRE_PROFILES = {
    "Pop": {
        "dance_mu": 0.72, "energy_mu": 0.74, "loud_mu": -6.0, "tempo_mu": 120,
        "acoust_mu": 0.20, "instr_mu": 0.02, "speech_mu": 0.08, "val_mu": 0.65, "pop_boost": 18
    },
    "Hip-Hop": {
        "dance_mu": 0.78, "energy_mu": 0.68, "loud_mu": -6.5, "tempo_mu": 135,
        "acoust_mu": 0.15, "instr_mu": 0.01, "speech_mu": 0.25, "val_mu": 0.55, "pop_boost": 16
    },
    "Electronic": {
        "dance_mu": 0.75, "energy_mu": 0.85, "loud_mu": -5.2, "tempo_mu": 128,
        "acoust_mu": 0.08, "instr_mu": 0.45, "speech_mu": 0.07, "val_mu": 0.52, "pop_boost": 12
    },
    "Rock": {
        "dance_mu": 0.52, "energy_mu": 0.82, "loud_mu": -6.2, "tempo_mu": 124,
        "acoust_mu": 0.12, "instr_mu": 0.18, "speech_mu": 0.05, "val_mu": 0.54, "pop_boost": 10
    },
    "R&B": {
        "dance_mu": 0.68, "energy_mu": 0.58, "loud_mu": -7.5, "tempo_mu": 110,
        "acoust_mu": 0.28, "instr_mu": 0.03, "speech_mu": 0.11, "val_mu": 0.58, "pop_boost": 14
    },
    "Latin": {
        "dance_mu": 0.80, "energy_mu": 0.78, "loud_mu": -5.5, "tempo_mu": 105,
        "acoust_mu": 0.22, "instr_mu": 0.01, "speech_mu": 0.09, "val_mu": 0.75, "pop_boost": 17
    },
    "Indie": {
        "dance_mu": 0.58, "energy_mu": 0.60, "loud_mu": -8.5, "tempo_mu": 118,
        "acoust_mu": 0.42, "instr_mu": 0.15, "speech_mu": 0.05, "val_mu": 0.46, "pop_boost": 6
    },
    "Classical": {
        "dance_mu": 0.28, "energy_mu": 0.22, "loud_mu": -20.0, "tempo_mu": 95,
        "acoust_mu": 0.92, "instr_mu": 0.85, "speech_mu": 0.04, "val_mu": 0.26, "pop_boost": -15
    },
    "Jazz": {
        "dance_mu": 0.55, "energy_mu": 0.45, "loud_mu": -12.0, "tempo_mu": 112,
        "acoust_mu": 0.70, "instr_mu": 0.55, "speech_mu": 0.06, "val_mu": 0.50, "pop_boost": -4
    },
    "Country": {
        "dance_mu": 0.62, "energy_mu": 0.65, "loud_mu": -7.0, "tempo_mu": 115,
        "acoust_mu": 0.38, "instr_mu": 0.02, "speech_mu": 0.04, "val_mu": 0.62, "pop_boost": 8
    }
}

SONG_TITLE_PARTS_1 = [
    "Midnight", "Electric", "Golden", "Velvet", "Neon", "Summer", "Ocean", "Echoes of",
    "Dancing with", "Higher", "Lost in", "Blinding", "Wild", "Chasing", "Starlight",
    "Sweet", "Shadow", "Broken", "Supernatural", "Forever", "Heartbeat", "Cosmic", "Crystal"
]
SONG_TITLE_PARTS_2 = [
    "Dreams", "Rhythm", "Groove", "Nights", "Mirage", "Fire", "Horizon", "Breeze",
    "Paradise", "Frequency", "Echo", "Whispers", "Memories", "Symphony", "Melody",
    "Waves", "Vibes", "Secrets", "Illusion", "Desire", "Sunrise", "Gravity", "Euphoria"
]
ARTIST_NAMES = [
    "Luna Ray", "The Neon Pulse", "Aria Vance", "Echo & The Waves", "Maya Lin",
    "Kavya Sharma", "Julian Cruz", "Oliver Bennett", "Sora Tanaka", "Elena Rostova",
    "Zack Phoenix", "Chloe Sterling", "Lucas Thorne", "Nadia Al-Mansoor", "Marcus Bell",
    "Tara Varma", "Leo Rivera", "Stella Nova", "Gabriel Santos", "Zara Quinn"
]

def generate_spotify_dataset(num_samples=4200, random_seed=42):
    """
    Generates a realistic multi-genre, multi-decade music dataset.
    """
    np.random.seed(random_seed)
    random.seed(random_seed)

    rows = []
    samples_per_genre = num_samples // len(GENRES)

    for genre in GENRES:
        prof = GENRE_PROFILES[genre]
        count = samples_per_genre

        # Generate release years spanning 1980 - 2024
        # Weighted towards recent decades (streaming era)
        decades = np.random.choice(
            [1980, 1990, 2000, 2010, 2020], 
            size=count, 
            p=[0.10, 0.15, 0.20, 0.30, 0.25]
        )
        years = decades + np.random.randint(0, 10, size=count)
        years = np.clip(years, 1980, 2024)

        # Historical shifts: Loudness war (1995-2015 got louder), acousticness decreased over time
        loudness_year_offset = (years - 1980) * 0.18  # gets louder over time
        acoustic_year_offset = (2024 - years) * 0.004  # older songs more acoustic

        # Sample audio features based on genre profile + noise
        danceability = np.clip(np.random.normal(prof["dance_mu"], 0.12, size=count), 0.05, 0.99)
        energy = np.clip(np.random.normal(prof["energy_mu"], 0.14, size=count), 0.05, 0.99)
        
        raw_loudness = prof["loud_mu"] + loudness_year_offset + np.random.normal(0, 2.0, size=count)
        loudness = np.clip(raw_loudness, -30.0, -1.0)

        tempo = np.clip(np.random.normal(prof["tempo_mu"], 18, size=count), 55.0, 210.0)
        
        raw_acoust = prof["acoust_mu"] + acoustic_year_offset + np.random.normal(0, 0.10, size=count)
        acousticness = np.clip(raw_acoust, 0.001, 0.99)
        
        instrumentalness = np.clip(np.random.exponential(scale=prof["instr_mu"], size=count), 0.0, 0.98)
        speechiness = np.clip(np.random.normal(prof["speech_mu"], 0.04, size=count), 0.01, 0.85)
        valence = np.clip(np.random.normal(prof["val_mu"], 0.15, size=count), 0.05, 0.98)

        # Non-linear popularity computation
        tempo_factor = np.exp(-((tempo - 122) ** 2) / (2 * (36 ** 2)))
        loudness_norm = (loudness + 30.0) / 30.0  # [0, 1]

        for i in range(count):
            d = danceability[i]
            e = energy[i]
            l_norm = loudness_norm[i]
            tf = tempo_factor[i]
            v = valence[i]
            ac = acousticness[i]
            inst = instrumentalness[i]
            sp = speechiness[i]
            yr = int(years[i])

            # Modern recency boost (newer songs naturally have higher current stream count)
            recency_boost = (yr - 1980) * 0.25

            # Underlying popularity formula with interaction terms
            raw_score = (
                28.0 * d +
                20.0 * e +
                14.0 * l_norm +
                9.0 * tf +
                12.0 * v -
                14.0 * ac -
                22.0 * np.sqrt(inst) -
                10.0 * (sp ** 1.5) +
                14.0 * (d * e) +
                prof["pop_boost"] +
                recency_boost +
                np.random.normal(0, 7.5)
            )

            # Map to strictly 0 - 100
            popularity = int(np.clip(np.round((raw_score - 10) / 85 * 90 + 5), 0, 100))
            is_hit = 1 if popularity >= 70 else 0

            # Hit tier categorization
            if popularity >= 85:
                hit_tier = "Diamond Hit"
            elif popularity >= 70:
                hit_tier = "Platinum Potential"
            elif popularity >= 50:
                hit_tier = "Gold Contender"
            elif popularity >= 30:
                hit_tier = "Silver Prospect"
            else:
                hit_tier = "Indie / Niche"

            title = f"{random.choice(SONG_TITLE_PARTS_1)} {random.choice(SONG_TITLE_PARTS_2)}"
            artist = random.choice(ARTIST_NAMES)
            duration_ms = int(np.random.normal(210000 - (yr - 1980) * 600, 25000))

            rows.append({
                "track_id": f"SONIQ_{len(rows)+1:04d}",
                "track_name": title,
                "artist_name": artist,
                "genre": genre,
                "release_year": yr,
                "duration_ms": max(90000, duration_ms),
                "danceability": round(float(d), 4),
                "energy": round(float(e), 4),
                "loudness": round(float(loudness[i]), 2),
                "tempo": round(float(tempo[i]), 1),
                "acousticness": round(float(ac), 4),
                "instrumentalness": round(float(inst), 4),
                "speechiness": round(float(sp), 4),
                "valence": round(float(v), 4),
                "popularity": popularity,
                "is_hit": is_hit,
                "hit_tier": hit_tier
            })

    df = pd.DataFrame(rows)

    # Add 2 intentional missing values and 2 duplicate rows to demonstrate cleaning pipeline
    df.loc[10, 'danceability'] = np.nan
    df.loc[25, 'loudness'] = np.nan
    df = pd.concat([df, df.iloc[[5, 12]]], ignore_index=True)

    return df

if __name__ == '__main__':
    os.makedirs('ml/data', exist_ok=True)
    df = generate_spotify_dataset(num_samples=4200)
    output_path = 'ml/data/spotify_tracks.csv'
    df.to_csv(output_path, index=False)
    print(f"Successfully generated {len(df)} tracks to '{output_path}'.")
