// Central Audio Player for 15s track previews using HTML5 Audio

let currentAudio = null;
let currentTimeout = null;

/**
 * Play 15-second audio preview from track.audio_url
 * @param {Object} track - Track object containing audio_url
 * @param {Function} onEnded - Callback triggered when playback stops/ends
 */
export function playTrackAudio(track, onEnded) {
  stopTrackAudio();

  if (!track || !track.audio_url) {
    if (onEnded) onEnded();
    return;
  }

  try {
    currentAudio = new Audio(track.audio_url);
    currentAudio.currentTime = 0;
    
    currentAudio.play().catch((err) => {
      console.warn("Audio autoplay policy notice:", err);
    });

    currentAudio.onended = () => {
      stopTrackAudio();
      if (onEnded) onEnded();
    };

    // Auto-stop after 15 seconds
    currentTimeout = setTimeout(() => {
      stopTrackAudio();
      if (onEnded) onEnded();
    }, 15000);
  } catch (err) {
    console.error("Error playing audio track:", err);
    if (onEnded) onEnded();
  }
}

/**
 * Stop active audio preview playback
 */
export function stopTrackAudio() {
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Open official YouTube video in new browser tab
 * @param {string} youtubeId 
 */
export function openYoutubeLink(youtubeId) {
  if (!youtubeId) return;
  window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank', 'noopener,noreferrer');
}
