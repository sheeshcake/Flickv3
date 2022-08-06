const tmdb_api = "https://api.themoviedb.org/3/";
const api_key = "7070e2fe1f83238edc3ada49acb2cb25";


const hero = async () => {
    const heromovie = await fetch(`${tmdb_api}discover/movie?api_key=${api_key}&language=${'en-US'}&page=1`)
    const moviedata = await heromovie.json()
    let hero_movie= moviedata.results.map(item => {
        return {
            id: item.id,
            type: 'movie',
            title: item.title,
            link: `movie/${item.id}-${String(item.title)
                .toLowerCase()
                .replace(/\W/g, "-")
                .replace(/-$/g, "")
                .replace(/--+/g, "-")}`,
            image: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
            description: item.overview,
            release: item.release_date,
            rating: item.vote_average,
            duration: item.runtime,
            director: item.director,
        }
    });
    const herotv = await fetch(`${tmdb_api}discover/tv?api_key=${api_key}&language=${'en-US'}&page=1`)
    const tvdata = await herotv.json()
    let hero_tv = tvdata.results.map(item => {
        return {
            id: item.id,
            type: 'tv',
            title: item.name,
            link: `${item.id}-${String(item.name)
                .toLowerCase()
                .replace(/\W/g, "-")
                .replace(/-$/g, "")
                .replace(/--+/g, "-")}`,
            image: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
            description: item.overview,
            release: item.first_air_date,
            rating: item.vote_average,
            duration: item.episode_run_time,
            director: item.creator,
        }
    })

    const hero_data = hero_movie.concat(hero_tv)
    return  hero_data;
}

const popular_movie = async () => {
    const popularmovie = await fetch(`${tmdb_api}movie/top_rated?api_key=${api_key}&language=${'en-US'}&sort_by=popularity.desc&page=1`)
    const moviedata = await popularmovie.json()
    let popular_movie= moviedata.results.map(item => {
        return {
            id: item.id,
            type: 'movie',
            title: item.title,
            link: `movie/${item.id}-${String(item.title)
                .toLowerCase()
                .replace(/\W/g, "-")
                .replace(/-$/g, "")
                .replace(/--+/g, "-")}`,
            image: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
            description: item.overview,
            release: item.release_date,
            rating: item.vote_average,
            duration: item.runtime,
            director: item.director,
        }
    });
    return popular_movie;
}


const horror_movie = async () => {
    const horrormovie = await fetch(`${tmdb_api}discover/movie?api_key=${api_key}&language=${'en-US'}&with_genres=27&page=1`)
    const moviedata = await horrormovie.json()
    let horror_movie= moviedata.results.map(item => {
        return {
            id: item.id,
            type: 'movie',
            title: item.title,
            link: `movie/${item.id}-${String(item.title)
                .toLowerCase()
                .replace(/\W/g, "-")
                .replace(/-$/g, "")
                .replace(/--+/g, "-")}`,
            image: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
            description: item.overview,
            release: item.release_date,
            rating: item.vote_average,
            duration: item.runtime,
            director: item.director,
        }
    });
    return horror_movie;
}

const action_movie = async () => {
    const actionmovie = await fetch(`${tmdb_api}discover/movie?api_key=${api_key}&language=${'en-US'}&with_genres=28&page=1`)
    const moviedata = await actionmovie.json()
    let action_movie= moviedata.results.map(item => {
        return {
            id: item.id,
            type: 'movie',
            title: item.title,
            link: `movie/${item.id}-${String(item.title)
                .toLowerCase()
                .replace(/\W/g, "-")
                .replace(/-$/g, "")
                .replace(/--+/g, "-")}`,
            image: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
            description: item.overview,
            release: item.release_date,
            rating: item.vote_average,
            duration: item.runtime,
            director: item.director,
        }
    });
    return action_movie;
}

const comedy_movie = async () => {
    const comedymovie = await fetch(`${tmdb_api}discover/movie?api_key=${api_key}&language=${'en-US'}&with_genres=35&page=1`)
    const moviedata = await comedymovie.json()
    let comedy_movie= moviedata.results.map(item => {
        return {
            id: item.id,
            type: 'movie',
            title: item.title,
            link: `movie/${item.id}-${String(item.title)
                .toLowerCase()
                .replace(/\W/g, "-")
                .replace(/-$/g, "")
                .replace(/--+/g, "-")}`,
            image: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
            description: item.overview,
            release: item.release_date,
            rating: item.vote_average,
            duration: item.runtime,
            director: item.director,
        }
    });
    return comedy_movie;
}

const romance_movie = async () => {
    const romancemovie = await fetch(`${tmdb_api}discover/movie?api_key=${api_key}&language=${'en-US'}&with_genres=10749&page=1`)
    const moviedata = await romancemovie.json()
    let romance_movie= moviedata.results.map(item => {
        return {
            id: item.id,
            type: 'movie',
            title: item.title,
            link: `movie/${item.id}-${String(item.title)
                .toLowerCase()
                .replace(/\W/g, "-")
                .replace(/-$/g, "")
                .replace(/--+/g, "-")}`,
            image: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
            description: item.overview,
            release: item.release_date,
            rating: item.vote_average,
            duration: item.runtime,
            director: item.director,
        }
    });
    return romance_movie;
}


const get_episodes = async (id ,name ,season) => {
    const episodes = await fetch(`${tmdb_api}tv/${id}/season/${season || 1}?api_key=${api_key}&language=${'en-US'}`)
    const episodedata = await episodes.json()
    let episodes_data= episodedata.episodes.map(item => {
        return {
            id: item.id,
            type: 'tv',
            title: item.name,
            overview: item.overview,
            link: `tv-show/${id}-${String(name)
                .toLowerCase()
                .replace(/\W/g, "-")
                .replace(/-$/g, "")
                .replace(/--+/g, "-")}/season-${season}/episode-${item.episode_number}`,
            image: `https://image.tmdb.org/t/p/w500/${item.still_path}`,
            description: item.overview,
        }
    });
    return episodes_data;
}

const get_episode_link = async (id, name, season, episode) => {
    return {
        link: `/tv-show/${id}-${String(name)
            .toLowerCase()
            .replace(/\W/g, "-")
            .replace(/-$/g, "")
            .replace(/--+/g, "-")}/season-${season}/episode-${episode}`,
    }
}


const get_seasons = async (id) => {
    const tv_details = await fetch(`${tmdb_api}tv/${id}?api_key=${api_key}&language=${'en-US'}`)
    const tvdata = await tv_details.json()
    let tv_details_data = {
        overview: tvdata.overview,
        seasons: tvdata.seasons,
    }
    return tv_details_data;
}


const popular_tv = async () => {
    const populartv = await fetch(`${tmdb_api}discover/tv?api_key=${api_key}&language=${'en-US'}&sort_by=popularity.desc&page=1`)
    const tvdata = await populartv.json()
    let popular_tv = tvdata.results.map(item => {
        return {
            id: item.id,
            type: 'tv',
            title: item.name,
            link: `${item.id}-${String(item.name)
                .toLowerCase()
                .replace(/\W/g, "-")
                .replace(/-$/g, "")
                .replace(/--+/g, "-")}`,
            image: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
            description: item.overview,
            release: item.first_air_date,
            rating: item.vote_average,
            duration: item.episode_run_time,
            director: item.creator,
        }
    })
    return popular_tv;
}


const search_movie = async (search) => {
    const searchmovie = await fetch(`${tmdb_api}search/movie?api_key=${api_key}&language=${'en-US'}&query=${search}&page=1`)
    const moviedata = await searchmovie.json()
    let search_movie = moviedata.results.map(item => {
        return {
            id: item.id,
            type: 'movie',
            title: item.title,
            link: `movie/${item.id}-${String(item.title)
                .toLowerCase()
                .replace(/\W/g, "-")
                .replace(/-$/g, "")
                .replace(/--+/g, "-")}`,
            image: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
            description: item.overview,
            release: item.release_date,
            rating: item.vote_average,
            duration: item.runtime,
            director: item.director,
        }
    })
    return search_movie;
}


const search_tv = async (search) => {
    const searchtv = await fetch(`${tmdb_api}search/tv?api_key=${api_key}&language=${'en-US'}&query=${search}&page=1`)
    const tvdata = await searchtv.json()
    let search_tv = tvdata.results.map(item => {
        return {
            id: item.id,
            type: 'tv',
            title: item.name,
            link: `${item.id}-${String(item.name)
                .toLowerCase()
                .replace(/\W/g, "-")
                .replace(/-$/g, "")
                .replace(/--+/g, "-")}`,
            image: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
            description: item.overview,
            release: item.first_air_date,
            rating: item.vote_average,
            duration: item.episode_run_time,
            director: item.creator,
        }
    })
    return search_tv;
}


export default {
    hero,
    popular_movie,
    horror_movie,
    action_movie,
    comedy_movie,
    romance_movie,
    popular_tv,
    get_seasons,
    get_episodes,
    get_episode_link,
    search_movie,
    search_tv,

}