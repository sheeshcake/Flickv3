// src/api/crawleeScraper.js
// Example: Scrape movie titles from IMDb's Most Popular Movies page using Crawlee

const { CheerioCrawler } = require('crawlee');

/**
 * Scrapes movie titles from IMDb's Most Popular Movies page.
 * @returns {Promise<string[]>} Array of movie titles
 */
async function scrapeImdbPopularMovies() {
    const url = 'https://www.imdb.com/chart/moviemeter/';
    const titles = [];

    const crawler = new CheerioCrawler({
        async requestHandler({ $, enqueueLinks, log }) {
            // Select movie title elements
            $(".ipc-title__text").each((i, el) => {
                const title = $(el).text();
                // Filter out non-movie rows (like table headers)
                if (title && isNaN(Number(title))) {
                    titles.push(title);
                }
            });
        },
    });

    await crawler.run([url]);
    return titles;
}

module.exports = {
    scrapeImdbPopularMovies,
};
