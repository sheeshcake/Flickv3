// stream.js
// Fetches streaming links from Vidking for a given TMDB ID

import { extractM3u8 } from './extractor.js';

/**
 * Get streaming links from Vidking
 * @param {Object} params - Parameters
 * @param {string} params.tmdbId - TMDB ID of the movie or show
 * @param {string} params.type - Content type ('movie' or 'tv')
 * @param {number} params.season - Season number (for TV shows)
 * @param {number} params.episode - Episode number (for TV shows)
 * @param {AbortSignal} params.signal - Abort signal for cancelling requests
 * @returns {Promise<Array>} - Array of streaming sources
 */
export const getStream = async function ({ tmdbId, type, season, episode, signal }) {
  try {
    // Construct the Vidking embed URL based on content type
    let embedUrl = '';
    if (type === 'movie') {
      embedUrl = `https://www.vidking.net/embed/movie/${tmdbId}?autoPlay=true&subtitle=english`;
    } else if (type === 'tv') {
      embedUrl = `https://www.vidking.net/embed/tv/${tmdbId}/${season}/${episode}?autoPlay=true&subtitle=english`;
    } else {
      console.error('Invalid content type');
      return [];
    }

    // Extract the m3u8 URL from the embed or get iframe URL as fallback
    const streamData = await extractM3u8(embedUrl, signal);
    
    if (!streamData || !streamData.url) {
      console.error('Failed to extract stream URL from Vidking');
      return [];
    }

    // Check if we're using the iframe fallback
    if (streamData.isIframe) {
      console.log('Using iframe fallback for Vidking player:', streamData.url);
      // Return the iframe URL as a special type
      return [{
        server: 'Vidking',
        name: 'Vidking (Iframe)',
        quality: streamData.quality || 'Auto',
        url: streamData.url,
        isIframe: true,
        headers: streamData.headers || {},
      }];
    }

    // Return the m3u8 stream data in the format expected by the app
    return [{
      server: 'Vidking',
      name: 'Vidking',
      quality: streamData.quality || 'Auto',
      url: streamData.url,
      isM3U8: true,
      headers: streamData.headers || {},
    }];
  } catch (error) {
    console.error('Error fetching Vidking stream:', error);
    return [];
  }
};

export default getStream;