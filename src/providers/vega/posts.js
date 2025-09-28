// posts.js
// Fetches lists of items and handles search

import { providerContext } from './providerContext';

export const getPosts = async function ({ filter, page, providerValue, signal, providerContext: ctx }) {
  try {
    const { axios, cheerio, getBaseUrl, commonHeaders } = ctx || providerContext;
    const baseUrl = await getBaseUrl(providerValue);
    
    if (!baseUrl) {
      console.error('Base URL not found for provider:', providerValue);
      return [];
    }

    const url = `${baseUrl}${filter}&page=${page}`;
    const response = await axios.get(url, { headers: commonHeaders, signal });
    const $ = cheerio.load(response.data);
    
    const posts = [];
    $('.flw-item').each((i, el) => {
      const $el = $(el);
      const title = $el.find('.film-name').text() || $el.find('.film-name a').attr('title');
      const link = $el.find('a').attr('href');
      const image = $el.find('img').attr('data-src') || $el.find('img').attr('src');
      const type = $el.find('.fdi-type').text()?.toLowerCase() || 'movie';
      const quality = $el.find('.film-poster-quality').text();
      
      if (title && link) {
        posts.push({
          title: title.trim(),
          link: link,
          image: image || '',
          type: type,
          quality: quality || '',
        });
      }
    });
    
    return posts;
  } catch (error) {
    console.error('Error in getPosts:', error);
    return [];
  }
};

export const getSearchPosts = async function ({ searchQuery, page, providerValue, signal, providerContext: ctx }) {
  try {
    const { axios, cheerio, getBaseUrl, commonHeaders } = ctx || providerContext;
    const baseUrl = await getBaseUrl(providerValue);
    
    if (!baseUrl) {
      console.error('Base URL not found for provider:', providerValue);
      return [];
    }

    const searchUrl = `${baseUrl}/search/${searchQuery.toLowerCase().replace(/ /g, '-')}?page=${page}`;
    const response = await axios.get(searchUrl, { headers: commonHeaders, signal });
    const $ = cheerio.load(response.data);
    
    const posts = [];
    $('.flw-item').each((i, el) => {
      const $el = $(el);
      const title = $el.find('.film-name').text() || $el.find('.film-name a').attr('title');
      const link = $el.find('a').attr('href');
      const image = $el.find('img').attr('data-src') || $el.find('img').attr('src');
      const type = $el.find('.fdi-type').text()?.toLowerCase() || 'movie';
      const quality = $el.find('.film-poster-quality').text();
      
      if (title && link) {
        posts.push({
          title: title.trim(),
          link: link,
          image: image || '',
          type: type,
          quality: quality || '',
        });
      }
    });
    
    return posts;
  } catch (error) {
    console.error('Error in getSearchPosts:', error);
    return [];
  }
};