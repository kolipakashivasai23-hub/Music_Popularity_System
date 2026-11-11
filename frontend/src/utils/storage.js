/**
 * SONIQ AI Local Personalization & Storage Manager
 */

const HISTORY_KEY = 'soniq_ai_prediction_history';
const FAVORITES_KEY = 'soniq_ai_favorites';
const PROFILE_KEY = 'soniq_ai_user_profile';

export const getPredictionHistory = () => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (_e) {
    return [];
  }
};

export const savePredictionToHistory = (item) => {
  try {
    const history = getPredictionHistory();
    const entry = {
      id: `pred_${Date.now()}`,
      timestamp: new Date().toISOString(),
      track_name: item.track_name || 'Custom Studio Mix',
      features: item.features,
      score: item.result?.predicted_popularity || 0,
      tier: item.result?.popularity_tier?.tier || 'Mainstream Hit',
      badge: item.result?.popularity_tier?.badge || '⚡ Mainstream Hit',
      color: item.result?.popularity_tier?.color || '#06B6D4',
      hit_pct: item.result?.hit_potential?.hit_percentage || 50
    };
    const updated = [entry, ...history.filter(h => h.id !== entry.id)].slice(0, 30);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (_e) {
    return [];
  }
};

export const clearPredictionHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
  return [];
};

export const getFavoriteTracks = () => {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (_e) {
    return [];
  }
};

export const toggleFavoriteTrack = (track) => {
  try {
    const favs = getFavoriteTracks();
    const exists = favs.some(f => f.id === track.id || f.track_name === track.track_name);
    let updated;
    if (exists) {
      updated = favs.filter(f => f.id !== track.id && f.track_name !== track.track_name);
    } else {
      updated = [track, ...favs];
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  } catch (_e) {
    return [];
  }
};

export const getUserProfile = () => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : {
      username: 'Audio Engineer',
      targetGenre: 'Pop',
      preferredTempo: 124,
      experienceLevel: 'Professional Producer',
      bio: 'Crafting chart-topping records with SONIQ AI audio intelligence.'
    };
  } catch (_e) {
    return { username: 'Audio Engineer', targetGenre: 'Pop', preferredTempo: 124 };
  }
};

export const saveUserProfile = (profile) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return profile;
  } catch (_e) {
    return profile;
  }
};
