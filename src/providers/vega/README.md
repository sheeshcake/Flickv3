# Vega Provider Integration

This vega provider implementation follows the vega-providers specification and includes all necessary extractors and utilities.

## File Structure

```
src/providers/vega/
├── catalog.js          # Categories and genres configuration
├── posts.js           # Fetches lists of items and handles search
├── meta.js            # Fetches metadata for specific items
├── stream.js          # Fetches streaming links
├── episodes.js        # Handles episode-specific logic for series
├── index.js           # Main provider entry point
├── providerContext.js # Provider context with utilities
├── extractors.js      # All extractors (gdflix, gofile, hubcloud, supervideo)
├── getBaseUrl.js      # Base URL fetching utility
├── headers.js         # Common HTTP headers
└── types.ts           # TypeScript type definitions (existing)
```

## Features

### Provider Functions
- **getPosts**: Fetches lists of movies/TV shows based on filters
- **getSearchPosts**: Handles search queries
- **getMeta**: Fetches detailed metadata for items
- **getStream**: Extracts streaming links using various extractors
- **getEpisodes**: Handles TV series episodes

### Extractors
- **gdFlixExtracter**: Extracts links from GDFlix sources
- **gofileExtracter**: Handles Gofile downloads
- **hubcloudExtracter**: Processes HubCloud links
- **superVideoExtractor**: Decodes SuperVideo streams

### Categories & Genres
- Popular/Latest Movies & TV Shows
- 12 different genres (Action, Comedy, Horror, etc.)

## Integration with App

### Method 1: Import the Provider Directly
```javascript
import { vegaProvider } from './src/providers/vega';

// Use in your provider list
const providers = [vegaProvider, ...otherProviders];
```

### Method 2: Use Individual Functions
```javascript
import { getPosts, getMeta, getStream } from './src/providers/vega';

// Use functions directly in your app logic
const posts = await getPosts({ 
  filter: '/filter?type=movie&sort=imdb', 
  page: 1, 
  providerValue: 'vega',
  signal: abortSignal,
  providerContext 
});
```

## Testing with vega-providers Dev Server

1. Clone the vega-providers repository
2. Run `npm install` and `npm run auto`
3. Note the Mobile test URL (e.g., `http://192.168.1.100:3001`)
4. In your app's ExtensionManager, set:
   ```javascript
   private testMode = true;
   private baseUrlTestMode = "http://192.168.1.100:3001";
   ```

## Configuration

The provider uses a base URL from the modflix.json configuration:
- URL: `https://himanshu8443.github.io/providers/modflix.json`
- Provider key: `vega`

## Dependencies

- axios: HTTP requests
- cheerio: HTML parsing
- expo-crypto: Cryptographic functions

## Usage Example

```javascript
import { vegaProvider } from './src/providers/vega';

// Get popular movies
const movies = await vegaProvider.GetHomePosts({
  filter: '/filter?type=movie&sort=imdb',
  page: 1,
  providerValue: 'vega',
  signal: new AbortController().signal,
  providerContext: vegaProvider.providerContext
});

// Search for content
const searchResults = await vegaProvider.GetSearchPosts({
  searchQuery: 'avengers',
  page: 1,
  providerValue: 'vega',
  signal: new AbortController().signal,
  providerContext: vegaProvider.providerContext
});

// Get metadata
const metadata = await vegaProvider.GetMetaData({
  link: '/movie/123-avengers',
  provider: { value: 'vega' },
  providerContext: vegaProvider.providerContext
});

// Get streaming links
const streams = await vegaProvider.GetStream({
  link: '/watch/123',
  type: 'movie',
  signal: new AbortController().signal,
  providerContext: vegaProvider.providerContext
});
```

## Provider Configuration Object

The `vegaProvider` object exports the following configuration:

```javascript
{
  name: 'Vega',
  value: 'vega',
  type: 'movie',
  flag: '🎬',
  catalog: [...],
  genres: [...],
  searchFilter: '/search/',
  blurImage: false,
  nonStreamableServer: [],
  nonDownloadableServer: [],
  GetHomePosts: getPosts,
  GetSearchPosts: getSearchPosts,
  GetMetaData: getMeta,
  GetStream: getStream,
  GetEpisodeLinks: getEpisodes,
}
```

This provider is now fully functional and ready to be integrated into your movie/TV show streaming application!