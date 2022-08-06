import axios from "axios"

const apiKey = "LrzMB5HQ7BgAN7sskO91mommP1ag3EBf"


export const getSubtitle = async (movie, token, season, episode) => {
    try {
        console.log("getting subtitle link")
        let query = `?tmdb_id=${movie.id}`
        if (movie.type == "tv") {
            query = `?tmdb_id=${movie.id}&season=${season}&episode=${episode}`
        }
        console.log("searching subtitle")
        const search = await fetch(`https://api.opensubtitles.com/api/v1/subtitles${query}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Api-key": apiKey
            }
        }).catch(e => console.log(e))
        console.log("downloading subtitle")
        const r_search = await search.json()
        const file_id = r_search.data[0]
        const formData = new FormData()
        console.log("file_id found: ", file_id.attributes.files[0].file_id)
        console.log("token:",token)
        formData.append("file_id", file_id.attributes.files[0].file_id)
        const subtitle = await fetch("https://api.opensubtitles.com/api/v1/download", {
            method: "POST",
            headers: {
                "User-Agent": "PostmanRuntime/7.29.2",
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
                "Api-Key": apiKey
            },
            body: JSON.stringify(formData)
        }).then(response => {console.log(response); response.json()}).catch(err => console.log("opensub Download: ", err))
        console.log("download complete: ", subtitle)
        return r_subtitle?.data?.link || false;
    } catch (err) {
        console.log(err)
    }
}

export const login = async (username, password) => {
    try {
        const login = await fetch("https://api.opensubtitles.com/api/v1/login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Api-key": apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        const r_login = await login.json()
        return {
            username: username,
            password: password,
            token: r_login.token
        }
    } catch (err) {
        console.log(err)
    }
}


export const logout = async (token) => {
    try {
        const logout = await fetch("https://api.opensubtitles.com/api/v1/logout", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Api-key": apiKey,
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const r_logout = await logout.json()
        return r_logout
    } catch (err) {
        console.log(err)
    }
}


export default {
    getSubtitle,
    login,
    logout
} 