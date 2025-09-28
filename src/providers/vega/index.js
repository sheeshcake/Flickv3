// index.js
// Main vega provider entry point

import { catalog, genres } from './catalog.js';
import { getPosts, getSearchPosts } from './posts.js';
import { getMeta } from './meta.js';
import { getStream } from './stream.js';
import { getEpisodes } from './episodes.js';
import { providerContext } from './providerContext';

// Vega provider configuration
export const vegaProvider = {
  name: 'Vega',
  value: 'vega',
  type: 'movie',
  flag: '🎬',
  catalog,
  genres,
  searchFilter: '/search/',
  blurImage: false,
  nonStreamableServer: [],
  nonDownloadableServer: [],
  
  // Main provider functions
  GetHomePosts: getPosts,
  GetSearchPosts: getSearchPosts,
  GetMetaData: getMeta,
  GetStream: getStream,
  GetEpisodeLinks: getEpisodes,
};

// Export individual functions for vega-providers compatibility
export {
  catalog,
  genres,
  getPosts,
  getSearchPosts,
  getMeta,
  getStream,
  getEpisodes,
  providerContext,
};

export default vegaProvider;