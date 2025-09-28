// src/api/consumetApi.js
// Direct API implementation for Consumet FlixHQ provider (React Native compatible)

const axios = require('axios');

const CONSUMET_BASE_URL = 'https://api.consumet.org';

/**
 * Search for movies or TV shows using FlixHQ provider via Consumet API.
 * @param {string} query - The search query (movie or TV show title)
 * @returns {Promise<Array>} Array of search results
 */
async function searchFlixHQ(query) {
    try {
        console.log('Searching FlixHQ via Consumet API for:', query);
        const response = await axios.get(`${CONSUMET_BASE_URL}/movies/flixhq/${encodeURIComponent(query)}`);
        console.log('Consumet search successful:', response.data.results?.length, 'results');
        return response.data.results || [];
    } catch (error) {
        console.error('Consumet API search failed:', error.message);
        throw new Error(`Search failed: ${error.message}`);
    }
}

/**
 * Get detailed info for a movie or TV show by ID
 * @param {string} id - The FlixHQ item ID
 * @returns {Promise<Object>} Movie/TV show details
 */
async function getFlixHQInfo(id) {
    try {
        console.log('Getting FlixHQ info via Consumet API for:', id);
        const response = await axios.get(`${CONSUMET_BASE_URL}/movies/flixhq/info/${encodeURIComponent(id)}`);
        console.log('Consumet info successful');
        return response.data;
    } catch (error) {
        console.error('Consumet API info failed:', error.message);
        throw new Error(`Get info failed: ${error.message}`);
    }
}

/**
 * Get streaming sources for a movie or episode
 * @param {string} episodeId - The episode ID
 * @param {string} mediaId - The media ID
 * @param {string} server - The server to use (optional)
 * @returns {Promise<Object>} Streaming sources
 */
async function getFlixHQSources(episodeId, mediaId, server = 'upcloud') {
    try {
        console.log('Getting FlixHQ sources via Consumet API for:', episodeId);
        const response = await axios.get(`${CONSUMET_BASE_URL}/movies/flixhq/watch/${encodeURIComponent(episodeId)}?mediaId=${encodeURIComponent(mediaId)}&server=${server}`);
        console.log('Consumet sources successful:', response.data.sources?.length, 'sources');
        return response.data;
    } catch (error) {
        console.error('Consumet API sources failed:', error.message);
        throw new Error(`Get sources failed: ${error.message}`);
    }
}

module.exports = {
    searchFlixHQ,
    getFlixHQInfo,
    getFlixHQSources,
};
