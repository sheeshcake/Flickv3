
export  const searchSubs = async (movie) => {
    const {
        open_subtitle_token
    } = useSelector(state => state.profile)
    try {
        let query = `?tmdb_id=${movie.id}`
        if (movie.type == "tv") {
            query = `?tmdb_id=${movie.id}&season=${tvSelected.season}&episode=${tvSelected.episode}`
        }
        const search = await fetch(`https://api.opensubtitles.com/api/v1/subtitles${query}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Api-key": "rPeiuYj1TQlmdksY0NMS89ghwmFv7s0y"
            }
        })
        const r_search = await search.json()
        const file_id = r_search.data[0]
        const formData = new FormData()
        formData.append("file_id", file_id.attributes.files[0].file_id)
        const subtitle = await fetch("https://api.opensubtitles.com/api/v1/download", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${open_subtitle_token}`,
                Accept: "application/json",
                "Api-key": "rPeiuYj1TQlmdksY0NMS89ghwmFv7s0y"
            },
            body: formData
        }).catch(err => console.log(err))
        const r_subtitle = await subtitle.json()
        console.log(r_subtitle)
        setSubtitle(r_subtitle.link)
    } catch (err) {
        console.log(err)
    }
}

export const login = async (username, password) => {
    try{
        const login = await fetch("https://api.opensubtitles.com/api/v1/login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Api-key": "rPeiuYj1TQlmdksY0NMS89ghwmFv7s0y",
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
    }catch(err){
        console.log(err)
    }
}


export const logout = async (token) => {
    try{
        const logout = await fetch("https://api.opensubtitles.com/api/v1/logout", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Api-key": "rPeiuYj1TQlmdksY0NMS89ghwmFv7s0y",
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const r_logout = await logout.json()
        return r_logout
    }catch(err){
        console.log(err)
    }
}


export default {
    searchSubs,
    login,
    logout
} 