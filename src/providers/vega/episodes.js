// episodes.js (optional)
// Handles episode-specific logic for series

import { providerContext } from './providerContext';

export const getEpisodes = async function ({ url, providerContext: ctx }) {
  try {
    const { axios, cheerio, getBaseUrl, commonHeaders } = ctx || providerContext;
    const baseUrl = await getBaseUrl('vega'); // or get from context
    
    if (!baseUrl) {
      console.error('Base URL not found');
      return [];
    }

    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    const response = await axios.get(fullUrl, { headers: commonHeaders });
    const $ = cheerio.load(response.data);
    
    const episodes = [];
    
    // Parse episodes from response
    $('.episode-item, .nav-item').each((i, el) => {
      const $episode = $(el);
      const episodeTitle = $episode.find('.episode-name, .nav-link').text() || 
                          $episode.find('.nav-link').attr('title')?.split(':')[0] ||
                          `Episode ${i + 1}`;
      const episodeLink = $episode.find('a').attr('href') || 
                         $episode.find('.nav-link').attr('data-linkid') ||
                         $episode.attr('data-id');
      
      if (episodeTitle && episodeLink) {
        episodes.push({
          title: episodeTitle.trim(),
          link: episodeLink
        });
      }
    });

    // If no episodes found with above selectors, try alternative selectors
    if (episodes.length === 0) {
      $('.server-item').each((i, el) => {
        const $item = $(el);
        const title = $item.text().trim() || `Episode ${i + 1}`;
        const link = $item.attr('data-id') || $item.attr('data-linkid');
        
        if (link) {
          episodes.push({
            title: title,
            link: link
          });
        }
      });
    }

    return episodes;
  } catch (error) {
    console.error('Error in getEpisodes:', error);
    return [];
  }
};