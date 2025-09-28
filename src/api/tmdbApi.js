import { TMDB_CONFIG } from '../config/tmdb';

const { API_KEY: TMDB_API_KEY, BASE_URL: TMDB_BASE_URL, IMAGE_BASE_URL: TMDB_IMAGE_BASE_URL } = TMDB_CONFIG;

// Simple fetch helper for TMDb API
const tmdbFetch = async (endpoint) => {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`TMDb API error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('TMDb API request failed:', error);
        throw error;
    }
};

// Function to get popular movies
export const getPopularMovies = async (page = 1) => {
    try {
        const data = await tmdbFetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`);
        return data.results.map(movie => ({
            id: movie.id.toString(),
            title: movie.title,
            image: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
            link: movie.id.toString(),
            type: 'movie',
            overview: movie.overview,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            backdrop_path: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : null
        }));
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return [];
    }
};

// Function to get popular TV shows
export const getPopularTVShows = async (page = 1) => {
    try {
        const data = await tmdbFetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`);
        return data.results.map(show => ({
            id: show.id.toString(),
            title: show.name,
            image: show.poster_path ? `${TMDB_IMAGE_BASE_URL}${show.poster_path}` : null,
            link: show.id.toString(),
            type: 'tv',
            overview: show.overview,
            first_air_date: show.first_air_date,
            vote_average: show.vote_average,
            backdrop_path: show.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${show.backdrop_path}` : null
        }));
    } catch (error) {
        console.error('Error fetching popular TV shows:', error);
        return [];
    }
};

// Function to get trending content (using discover as fallback since trending might have issues)
export const getTrending = async (mediaType = 'all', timeWindow = 'day', page = 1) => {
    try {
        if (mediaType === 'movie') {
            const data = await tmdbFetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`);
            return data.results.map(item => ({
                id: item.id.toString(),
                title: item.title,
                image: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : null,
                link: item.id.toString(),
                type: 'movie',
                overview: item.overview,
                release_date: item.release_date,
                vote_average: item.vote_average,
                backdrop_path: item.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${item.backdrop_path}` : null
            }));
        } else if (mediaType === 'tv') {
            const data = await tmdbFetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`);
            return data.results.map(item => ({
                id: item.id.toString(),
                title: item.name,
                image: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : null,
                link: item.id.toString(),
                type: 'tv',
                overview: item.overview,
                release_date: item.first_air_date,
                vote_average: item.vote_average,
                backdrop_path: item.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${item.backdrop_path}` : null
            }));
        } else {
            // Get mixed content
            const [movieData, tvData] = await Promise.all([
                tmdbFetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`),
                tmdbFetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`)
            ]);
            const movies = movieData.results.slice(0, 10).map(item => ({
                id: item.id.toString(),
                title: item.title,
                image: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : null,
                link: item.id.toString(),
                type: 'movie',
                overview: item.overview,
                release_date: item.release_date,
                vote_average: item.vote_average,
                backdrop_path: item.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${item.backdrop_path}` : null
            }));
            const tvShows = tvData.results.slice(0, 10).map(item => ({
                id: item.id.toString(),
                title: item.name,
                image: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : null,
                link: item.id.toString(),
                type: 'tv',
                overview: item.overview,
                release_date: item.first_air_date,
                vote_average: item.vote_average,
                backdrop_path: item.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${item.backdrop_path}` : null
            }));
            return [...movies, ...tvShows];
        }
    } catch (error) {
        console.error('Error fetching trending content:', error);
        return [];
    }
};

// Function to get movies/TV shows by genre
export const getByGenre = async (genreId, type = 'movie', page = 1) => {
    try {
        const data = await tmdbFetch(`${TMDB_BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&language=en-US&with_genres=${genreId}&page=${page}`);
        
        return data.results.map(item => ({
            id: item.id.toString(),
            title: item.title || item.name,
            image: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : null,
            link: item.id.toString(),
            type: type,
            overview: item.overview,
            release_date: item.release_date || item.first_air_date,
            vote_average: item.vote_average,
            backdrop_path: item.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${item.backdrop_path}` : null
        }));
    } catch (error) {
        console.error(`Error fetching ${type} by genre:`, error);
        return [];
    }
};

// Function to search movies and TV shows
export const searchTMDb = async (query, page = 1) => {
    try {
        const [movieData, tvData] = await Promise.all([
            tmdbFetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`),
            tmdbFetch(`${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`)
        ]);
        
        const movies = movieData.results.map(item => ({
            id: item.id.toString(),
            title: item.title,
            image: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : null,
            link: item.id.toString(),
            type: 'movie',
            overview: item.overview,
            release_date: item.release_date,
            vote_average: item.vote_average,
            backdrop_path: item.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${item.backdrop_path}` : null
        }));
        
        const tvShows = tvData.results.map(item => ({
            id: item.id.toString(),
            title: item.name,
            image: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : null,
            link: item.id.toString(),
            type: 'tv',
            overview: item.overview,
            release_date: item.first_air_date,
            vote_average: item.vote_average,
            backdrop_path: item.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${item.backdrop_path}` : null
        }));
        
        return [...movies, ...tvShows];
    } catch (error) {
        console.error('Error searching TMDb:', error);
        return [];
    }
};

// Function to get movie/TV show details
export const getTMDbDetails = async (id, type) => {
    try {
        const url = type === 'movie' 
            ? `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,recommendations`
            : `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,recommendations`;
        
        const data = await tmdbFetch(url);
        
        return {
            id: data.id.toString(),
            title: data.title || data.name,
            image: data.poster_path ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}` : null,
            backdrop_path: data.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${data.backdrop_path}` : null,
            overview: data.overview,
            release_date: data.release_date || data.first_air_date,
            vote_average: data.vote_average,
            genres: data.genres,
            runtime: data.runtime || data.episode_run_time?.[0],
            type: type,
            // Additional data from append_to_response
            cast: data.credits?.cast || [],
            crew: data.credits?.crew || [],
            videos: data.videos?.results || [],
            recommendations: data.recommendations?.results || [],
            // TV specific
            number_of_seasons: data.number_of_seasons,
            number_of_episodes: data.number_of_episodes,
            // Movie specific
            budget: data.budget,
            revenue: data.revenue
        };
    } catch (error) {
        console.error('Error fetching TMDb details:', error);
        throw error;
    }
};

// Function to get TV show seasons and episodes
export const getTVSeasons = async (tvId) => {
    try {
        const showData = await tmdbFetch(`${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}&language=en-US`);
        const seasons = [];
        
        for (const season of showData.seasons) {
            if (season.season_number > 0) { // Skip specials (season 0)
                try {
                    const seasonData = await tmdbFetch(`${TMDB_BASE_URL}/tv/${tvId}/season/${season.season_number}?api_key=${TMDB_API_KEY}&language=en-US`);
                    seasons.push({
                        id: season.season_number.toString(),
                        season: season.season_number,
                        name: season.name,
                        overview: season.overview,
                        poster_path: season.poster_path ? `${TMDB_IMAGE_BASE_URL}${season.poster_path}` : null,
                        episodes: seasonData.episodes.map(episode => ({
                            id: `${season.season_number}_${episode.episode_number}`,
                            episode: episode.episode_number,
                            title: episode.name,
                            overview: episode.overview,
                            still_path: episode.still_path ? `${TMDB_IMAGE_BASE_URL}${episode.still_path}` : null,
                            image: episode.still_path ? `${TMDB_IMAGE_BASE_URL}${episode.still_path}` : null, // Map still_path to image for UI compatibility
                            air_date: episode.air_date,
                            vote_average: episode.vote_average,
                            tmdbId: tvId
                        }))
                    });
                } catch (seasonError) {
                    console.error(`Error fetching season ${season.season_number}:`, seasonError);
                }
            }
        }
        
        return seasons;
    } catch (error) {
        console.error('Error fetching TV seasons:', error);
        return [];
    }
};

// Function to get movie details by ID
export const getMovieDetails = async (movieId) => {
    try {
        const data = await tmdbFetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,recommendations`);
        
        return {
            ...data,
            poster_path: data.poster_path ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}` : null,
            backdrop_path: data.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${data.backdrop_path}` : null,
            genres: data.genres || [],
            cast: data.credits?.cast || [],
            crew: data.credits?.crew || [],
            videos: data.videos?.results || [],
            recommendations: data.recommendations?.results || []
        };
    } catch (error) {
        console.error('Error getting movie details:', error);
        return null;
    }
};

// Function to get TV show details by ID
export const getTVDetails = async (tvId) => {
    try {
        const data = await tmdbFetch(`${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,recommendations`);
        
        return {
            ...data,
            poster_path: data.poster_path ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}` : null,
            backdrop_path: data.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${data.backdrop_path}` : null,
            genres: data.genres || [],
            cast: data.credits?.cast || [],
            crew: data.credits?.crew || [],
            videos: data.videos?.results || [],
            recommendations: data.recommendations?.results || []
        };
    } catch (error) {
        console.error('Error getting TV details:', error);
        return null;
    }
};

// Function to get videos for a movie or TV show
export const getVideos = async (id, type) => {
    try {
        const url = type === 'movie' 
            ? `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
            : `${TMDB_BASE_URL}/tv/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`;
        
        const data = await tmdbFetch(url);
        return data.results || [];
    } catch (error) {
        console.error('Error getting videos:', error);
        return [];
    }
};

// Genre mapping for easier use
export const GENRES = {
    // Movie genres
    ACTION: 28,
    ADVENTURE: 12,
    ANIMATION: 16,
    COMEDY: 35,
    CRIME: 80,
    DOCUMENTARY: 99,
    DRAMA: 18,
    FAMILY: 10751,
    FANTASY: 14,
    HISTORY: 36,
    HORROR: 27,
    MUSIC: 10402,
    MYSTERY: 9648,
    ROMANCE: 10749,
    SCIENCE_FICTION: 878,
    THRILLER: 53,
    WAR: 10752,
    WESTERN: 37,
    
    // TV genres
    ACTION_ADVENTURE: 10759,
    KIDS: 10762,
    NEWS: 10763,
    REALITY: 10764,
    SOAP: 10766,
    TALK: 10767,
    WAR_POLITICS: 10768
};

export default {
    getPopularMovies,
    getPopularTVShows,
    getTrending,
    getByGenre,
    searchTMDb,
    getTMDbDetails,
    getTVSeasons,
    GENRES
};