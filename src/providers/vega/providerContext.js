// providerContext.js
// Context for provider functions (JavaScript version)

import axios from 'axios';
import { getBaseUrl } from './getBaseUrl.js';
import { headers } from './headers.js';
import * as cheerio from 'cheerio';
import { 
  hubcloudExtracter, 
  gofileExtracter, 
  superVideoExtractor, 
  gdFlixExtracter 
} from './extractors.js';

/**
 * Context for provider functions.
 * This context is used to pass common dependencies to provider functions.
 */

const extractors = {
  hubcloudExtracter,
  gofileExtracter,
  superVideoExtractor,
  gdFlixExtracter,
};

export const providerContext = {
  axios,
  getBaseUrl,
  commonHeaders: headers,
  cheerio,
  extractors,
};