// Import wyzie-lib correctly according to documentation
import { searchSubtitles, parseToVTT } from 'wyzie-lib';

// Format IMDB ID to match Wyzie API requirements
export const formatImdbId = (tmdbId) => {
  return tmdbId.toString();
};

// Get the best subtitle from a list of subtitles
export const getBestSubtitle = (subtitles, language = 'en') => {
  if (!subtitles || subtitles.length === 0) {
    return null;
  }
  
  // Filter by language
  const languageSubtitles = subtitles.filter(sub => sub.language === language);
  
  if (languageSubtitles.length === 0) {
    return subtitles[0]; // Return any subtitle if no matching language
  }
  
  // Sort by quality or rating if available
  return languageSubtitles[0];
};

// Fetch subtitles for a movie
export const getMovieSubtitle = async (movieId, options = { language: 'en' }) => {
  try {
    // Use the wyzie-lib npm package to fetch subtitles
    const subtitles = await searchSubtitles({
      tmdb_id: movieId,
      language: options.language,
      format: 'srt'
    });
    
    if (subtitles && subtitles.length > 0) {
      const bestSubtitle = getBestSubtitle(subtitles, options.language);
      
      // Parse the subtitle content to VTT format if content is available
      // if (bestSubtitle.content) {
      //   const vttContent = parseToVTT(bestSubtitle.content);
      //   
      //   // Return both the URL and the parsed VTT content
      //   return {
      //     url: bestSubtitle.url,
      //     vttContent: vttContent,
      //     language: bestSubtitle.language
      //   };
      // }
      
      // If no content is available, just return the URL
      return {
        url: bestSubtitle.url,
        language: bestSubtitle.language
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// Fetch subtitles for a TV show episode
export const getTvSubtitle = async (showId, season, episode, options = { language: 'en' }) => {
  try {
    // Validate parameters
    if (!showId || !season || !episode) {
      return null;
    }
    
    // Convert parameters to the correct types
    const tmdbId = String(showId);
    const seasonNum = Number(season);
    const episodeNum = Number(episode);
    
    // Use the wyzie-lib npm package to fetch subtitles
    const subtitles = await searchSubtitles({
      tmdb_id: tmdbId,
      season: seasonNum,
      episode: episodeNum,
      language: options.language || 'en',
      format: 'srt'
    });
    
    if (subtitles && subtitles.length > 0) {
      const bestSubtitle = getBestSubtitle(subtitles, options.language);
      
      // Parse the subtitle content to VTT format if content is available
      // if (bestSubtitle.content) {
      //   const vttContent = parseToVTT(bestSubtitle.content);
      //   
      //   // Return both the URL and the parsed VTT content
      //   return {
      //     url: bestSubtitle.url,
      //     vttContent: vttContent,
      //     language: bestSubtitle.language
      //   };
      // }
      
      // If no content is available, just return the URL
      return {
        url: bestSubtitle.url,
        language: bestSubtitle.language
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// General function to fetch subtitles
export const fetchSubtitles = async (mediaId, mediaType, season = null, episode = null, options = {}) => {
  if (mediaType === 'tv' && season !== null && episode !== null) {
    return getTvSubtitle(mediaId, season, episode, options);
  } else {
    return getMovieSubtitle(mediaId, options);
  }
};

export default {
  formatImdbId,
  getBestSubtitle,
  getMovieSubtitle,
  getTvSubtitle,
  fetchSubtitles
};