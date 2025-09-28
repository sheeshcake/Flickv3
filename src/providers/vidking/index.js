// index.js
// Main Vidking provider entry point

import { getStream } from './stream.js';
import { extractM3u8 } from './extractor.js';

// Vidking provider configuration
export const vidkingProvider = {
  name: 'Vidking',
  value: 'vidking',
  type: 'movie',
  flag: '🎬',
  nonStreamableServer: [],
  nonDownloadableServer: [],
  
  // Main provider functions
  GetStream: getStream,
};

// Export individual functions
export {
  getStream,
  extractM3u8,
};

export default vidkingProvider;