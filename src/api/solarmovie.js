
const axios = require("axios");
const cheerio = require('cheerio/lib/slim');

const solarmovie = "https://solarmovie.pe/";


const getData = async (html, type, is_search) => {
    const result = [];
    const $ = cheerio.load(html || "");
    $(".flw-item").each((i, el) => {
        const $ = cheerio.load(el);
        const title = $(".film-name").text() || $(".film-name > a").attr("title");
        const quality = $(".film-poster-quality").text();
        const link = $("a").attr("href");
        const image = $("img").attr("data-src");
        const type_data = $("span.fdi-type").text()?.toLowerCase() || type;
        if(is_search){
            if(type_data == type){
                result.push({
                    id: link.split("-")[link.split('-').length - 1],
                    title: title,
                    link: link,
                    image: image,
                    type: type_data,
                    quality: quality,
                });
            }
        }else{
            result.push({
                id: link.split("-")[link.split('-').length - 1],
                title: title,
                link: link,
                image: image,
                type: type_data,
                quality: quality,
            });
        }
        
    });
    return result;
}



export const hero = async () => {
    try {
        const response = await axios.get(`${solarmovie}filter?type=all&quality=all&release_year=2022&genre=all&country=all`);
        return getData(response.data);
    }
    catch (error) {
        console.log(error);
    }
    return false;
}

export const popular_movie = async () => {
    try {
        const response = await axios.get(`${solarmovie}top-imdb?type=movie`);
        return getData(response.data);
    }
    catch (error) {
        console.log(error);
    }
    return false;
}



export const horror_movie = async () => {
    try {
        const response = await axios.get(`${solarmovie}/filter?type=movie&quality=all&release_year=all&genre=14&country=all`);
        return getData(response.data);
    }
    catch (error) {
        console.log(error);
    }
    return false;
}

export const action_movie = async () => {
    try {
        const response = await axios.get(`${solarmovie}/filter?type=movie&quality=all&release_year=all&genre=10&country=all`);
        return getData(response.data);
    }
    catch (error) {
        console.log(error);
    }
    return false;
}


export const comedy_movie = async () => {
    try {
        const response = await axios.get(`${solarmovie}/filter?type=movie&quality=all&release_year=all&genre=7&country=all`);
        return getData(response.data);
    }
    catch (error) {
        console.log(error);
    }
    return false;
}


export const romance_movie = async () => {
    try {
        const response = await axios.get(`${solarmovie}/filter?type=movie&quality=all&release_year=all&genre=12&country=all`);
        return getData(response.data);
    }
    catch (error) {
        console.log(error);
    }
    return false;
}

export const popular_tv = async () => {
    try {
        const response = await axios.get(`${solarmovie}top-imdb?type=tv`);
        return getData(response.data);
    } catch (error) {
        console.log(error);
    }
}


export const tv_shows = async () => {
    try {
        const response = await axios.get(`${solarmovie}tv-show`);
        return getData(response.data);
    } catch (error) {
        console.log(error);
    }
}


const search_movie = async (title) => {
    try {
        const response = await axios.get(`${solarmovie}search/${title.toLowerCase().replace(/ /g, "-")}`);
        return getData(response.data, "movie", true);
    } catch (error) {
        console.log(error);
    }
}



const search_tv = async (title) => {
    try {
        const response = await axios.get(`${solarmovie}search/${title.toLowerCase().replace(/ /g, "-")}`);
        return getData(response.data, "tv", true);
    } catch (error) {
        console.log(error);
    }
}


export const get_tv_details = async (id) => {
    try {
        const url = `${solarmovie}ajax/v2/tv/seasons/${id}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        let seasons = []
        $(".ss-item").each((i, el) => {
            const $ = cheerio.load(el);
            const name = $(".ss-item").text();
            const link = $(".ss-item").attr("data-id");
            const id = $(".ss-item").attr("data-id");
            seasons.push({
                id,
                name,
                link
            });
        })
        const result = {
            id: id,
            seasons: seasons,
        }
        return result;
    } catch (error) {
        console.log(error);
    }

}


export const get_episodes = async (id, seasonID) => {
    try {
        const response = await axios.get(`${solarmovie}ajax/v2/season/episodes/${seasonID}`);
        const $ = cheerio.load(response.data);
        const result = [];
        $(".nav-item").each((i, el) => {
            const $ = cheerio.load(el);
            const id = $(".nav-link").attr("data-id");
            const title = $(".nav-link").attr("title").split(":")[0];
            const overview = $(".nav-link").attr("title").split(":")[1];
            result.push({
                id,
                title,
                overview
            });
        });
        return result;
    } catch (error) {
        console.log("get_episodes",error);
    }
}





export default {
    hero,
    popular_movie,
    horror_movie,
    action_movie,
    comedy_movie,
    romance_movie,
    popular_tv,
    tv_shows,
    get_tv_details,
    get_episodes,
    search_movie,
    search_tv
}