// TMDb Configuration
// Get your API key from: https://www.themoviedb.org/settings/api

export const TMDB_CONFIG = {
    // This appears to be a JWT Bearer token (Read Access Token)
    // It should work with the updated authentication method
    API_KEY: '7070e2fe1f83238edc3ada49acb2cb25',
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
    BACKDROP_BASE_URL: 'https://image.tmdb.org/t/p/w1280'
};

// Instructions to get your TMDb API key:
// 1. Go to https://www.themoviedb.org/
// 2. Create an account or sign in
// 3. Go to https://www.themoviedb.org/settings/api
// 4. You can use either:
//    - API Key (v3 auth): A simple string like 'abc123...'
//    - Read Access Token (v4 auth): A JWT token starting with 'eyJ...'
// 5. Copy your token and replace the API_KEY above
//
// NOTE: The current token appears to be from 2022 and may be expired.
// If you're still getting 401 errors, try generating a new token from TMDb settings.