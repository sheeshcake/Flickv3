# TMDb API Integration Setup

This project now uses the real TMDb (The Movie Database) API to fetch movie and TV show data instead of hardcoded content.

## Getting Your TMDb API Key

1. **Create a TMDb Account**
   - Go to [https://www.themoviedb.org/](https://www.themoviedb.org/)
   - Click "Join TMDb" and create a free account

2. **Request an API Key**
   - Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Click "Create" to request a new API key
   - Choose "Developer" for the type of use
   - Fill out the required form fields:
     - **Application Name**: Your app name (e.g., "Flick Movie App")
     - **Application URL**: Your app URL or GitHub repo
     - **Application Summary**: Brief description of your app
   - Accept the terms and submit

3. **Configure Your API Key**
   - Copy your API key from the TMDb settings page
   - Open `src/config/tmdb.js`
   - Replace `'YOUR_TMDB_API_KEY_HERE'` with your actual API key

## What's New

### Real Data Integration
- **Popular Movies & TV Shows**: Now fetches real popular content from TMDb
- **Trending Content**: Gets actually trending movies and TV shows
- **Genre-based Content**: Browse content by actual genres
- **Detailed Information**: Rich metadata including ratings, release dates, overviews
- **TV Show Seasons & Episodes**: Real season and episode data

### New Features
- **Search Functionality**: Search movies and TV shows using TMDb's search API
- **Detailed Movie/TV Info**: Get comprehensive details for any movie or TV show
- **Genre Browsing by Name**: Use genre names like 'action', 'comedy', etc.
- **Better Error Handling**: Graceful fallbacks when API fails

### API Functions Available

#### Content Discovery
- `getPopularMovies(page)` - Get popular movies
- `getPopularTVShows(page)` - Get popular TV shows  
- `getTrending(mediaType, timeWindow, page)` - Get trending content
- `getByGenre(genreId, type, page)` - Get content by genre
- `searchTMDb(query, page)` - Search movies and TV shows

#### Detailed Information
- `getTMDbDetails(id, type)` - Get detailed info for movie/TV show
- `getTVSeasons(tvId)` - Get seasons and episodes for TV show

#### Genre Mapping
- All genre IDs are available in the `GENRES` object
- Use genre names with `getgenreByNameVidking()` function

## Usage Examples

```javascript
// Get popular movies
const movies = await getPopularMovies(1);

// Get trending content for the week
const trending = await getTrending('all', 'week', 1);

// Get action movies
const actionMovies = await getByGenre(GENRES.ACTION, 'movie', 1);

// Search for content
const searchResults = await searchTMDb('avengers', 1);

// Get TV show seasons
const seasons = await getTVSeasons('119051'); // Wednesday
```

## VidkingProvider Updates

The VidkingProvider now uses real TMDb data:
- `getheroVidking()` - Fetches real popular and trending content
- `getgenreVidking()` - Gets real genre-based content
- `getgenreByNameVidking()` - Browse by genre name
- `loadTvDataVidking()` - Loads real TV seasons and episodes
- `getRecommendedVidking()` - Gets real trending recommendations

## Error Handling

All functions include proper error handling with fallbacks:
- If TMDb API fails, fallback to hardcoded popular content
- If specific requests fail, alternative content is provided
- All errors are logged for debugging

## Rate Limits

TMDb API has rate limits:
- **Free accounts**: 40 requests per 10 seconds
- Be mindful of making too many concurrent requests
- The implementation includes basic error handling for rate limits

## Next Steps

1. Get your TMDb API key and configure it
2. Test the integration by running the app
3. Explore the new genre browsing and search features
4. Consider implementing caching for frequently requested data

Enjoy your enhanced movie and TV show browsing experience with real, up-to-date data!