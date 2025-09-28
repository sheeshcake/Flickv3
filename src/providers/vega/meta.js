// meta.js
// Fetches metadata for a specific item

import { providerContext } from './providerContext';

export const getMeta = async function ({ link, providerContext: ctx }) {
  try {
    const { axios, cheerio, getBaseUrl, commonHeaders } = ctx || providerContext;
    const baseUrl = await getBaseUrl('vega'); // or get from context
    
    if (!baseUrl) {
      console.error('Base URL not found');
      return null;
    }

    const url = `${baseUrl}${link}`;
    const response = await axios.get(url, { headers: commonHeaders });
    const $ = cheerio.load(response.data);
    
    const title = $('.heading-name').text() || $('.film-name').text();
    const image = $('.film-poster img').attr('src') || $('.film-poster img').attr('data-src');
    const synopsis = $('.description').text() || $('.film-description').text();
    const imdbId = $('[data-imdb]').attr('data-imdb') || '';
    const type = $('.film-stats .item:contains("Type")').text().includes('TV') ? 'tv' : 'movie';
    const rating = $('.film-stats .item .text-highlight').text();
    
    // Get cast information
    const cast = [];
    $('.cast .item').each((i, el) => {
      const castName = $(el).find('.name').text();
      if (castName) cast.push(castName);
    });

    // Get tags/genres
    const tags = [];
    $('.genres a').each((i, el) => {
      const genre = $(el).text();
      if (genre) tags.push(genre);
    });

    // Build linkList for seasons/episodes
    const linkList = [];
    
    if (type === 'tv') {
      // Get seasons
      $('.seasons .season-item').each((i, el) => {
        const $season = $(el);
        const seasonTitle = $season.find('.season-name').text();
        const seasonId = $season.attr('data-id');
        
        if (seasonTitle && seasonId) {
          linkList.push({
            title: seasonTitle,
            episodesLink: `/ajax/v2/season/episodes/${seasonId}`,
            quality: '1080p'
          });
        }
      });
    } else {
      // For movies, add direct link
      linkList.push({
        title: 'Movie',
        directLinks: [{
          title: title,
          link: link,
          type: 'movie'
        }],
        quality: '1080p'
      });
    }

    return {
      title: title?.trim() || 'Unknown Title',
      synopsis: synopsis?.trim() || 'No synopsis available',
      image: image || '',
      imdbId: imdbId,
      type: type,
      rating: rating || '',
      cast: cast,
      tags: tags,
      linkList: linkList,
    };
  } catch (error) {
    console.error('Error in getMeta:', error);
    return null;
  }
};