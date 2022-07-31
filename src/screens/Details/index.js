import { View, Text, Image, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, sizes } from '~/constants/theme'
import MediaPlayer from '~/components/MediaPlayer'
import { ScrollView } from 'react-native-gesture-handler'
import TheFlixProvider from "~/providers/KrazyDevsScrapper/TheFlixProvider";
import TvDetails from '~/components/TvDetails'
import TvEpisodes from '~/components/TvEpisodes'
const axios = require("axios");
import {
    startDownload
} from "~/helpers/useDownload"


const Details = ({ navigation, route }) => {
    const { movie } = route.params;
    const [video, setVideo] = useState(null);
    const [status, setStatus] = useState('loading');
    const [seasonData, setSeasonData] = useState([]);
    const [tvLink, setTvLink] = useState("");
    const [subtitle, setSubtitle] = useState("")


    const searchSubs = async () => {
        const search = await fetch(`https://api.opensubtitles.com/api/v1/subtitles?tmdb_id=${movie.id}`, {
            method: "GET",
            headers: {
                Accept : "application/json",
                "Api-key": "rPeiuYj1TQlmdksY0NMS89ghwmFv7s0y"
            }
        })
        const r_search = await search.json()
        const file_id = r_search.data.find(x => 
            x.type == "subtitle" && x.attributes.language == "en"
        )
        const formData = new FormData()
        formData.append("file_id", file_id.attributes.files[0].file_id)
        const subtitle = await fetch("https://api.opensubtitles.com/api/v1/download", {
            method: "POST",
            headers: {
                Accept : "application/json",
                "Api-key": "rPeiuYj1TQlmdksY0NMS89ghwmFv7s0y"
            },
            body: formData
        }).catch(err => console.log(err))
        const r_subtitle = await subtitle.json()
        console.log(r_subtitle.link)
        setSubtitle(r_subtitle.link)
    }


    function onDownload () {
        console.log(status)
        startDownload(movie, video)
        if(status){
            alert("Download has Started!");
        }else{
            alert("Error Downloading.. :(")
        }
    }


    const getVideo = async () => {
        setStatus('loading');
        try {
            const video = await TheFlixProvider.loadFlicks(movie.link, movie.type);
            console.log(video);
            setVideo(video.url);
            setStatus('success');
        } catch (error) {
            setStatus('error');
        }
    }

    const getTv = async () => {
        setStatus('loading');
        if (!tvLink.includes('undefined') && !tvLink.includes('null')) {
            try {
                const tv = await TheFlixProvider.loadFlicks(tvLink, movie.type);
                setVideo(tv.url);
                setStatus('success');
            } catch (error) {
                setStatus('error');
            }
        }
    }

    useEffect(() => {
        movie.type == "movie" ? getVideo() : getTv();
        searchSubs()
    }, [tvLink])


    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: colors.black,
                padding: 0
            }}
        >
            <MediaPlayer
                title={movie.title}
                video={video}
                movie={movie}
                status={status}
                setStatus={(d) => setStatus(d)}
                imageUrl={movie.image}
                navigation={navigation}
                subtitle={subtitle}
                onDownload={() => onDownload()}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    marginTop: 20,
                }}
            >
                <View
                    style={{
                        padding: sizes.padding,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Image
                            source={{ uri: movie.image }}
                            style={{
                                width: sizes.width * 0.25,
                                height: sizes.width * 0.45,
                                borderRadius: 10,
                                marginHorizontal: 10,
                            }}
                        />
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "column",
                                alignItems: "flex-start",
                                paddingTop: 15,
                                marginHorizontal: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 30,
                                    fontWeight: "bold",
                                    color: colors.light,
                                    paddingBottom: 5,
                                }}
                            >{movie.title}</Text>
                            <Text
                                style={{
                                    color: colors.light,
                                }}
                            >
                                {movie.description}
                            </Text>
                        </View>
                    </View>
                    {
                        movie.type === "tv" && (
                            <View>
                                <TvDetails
                                    setSeasonData={(data) => setSeasonData(data)}
                                    tv={movie}
                                />
                                <TvEpisodes
                                    tv={movie}
                                    seasonData={seasonData}
                                    setVideo={(video) => setTvLink(video)}
                                />
                            </View>
                        )
                    }
                </View>
            </ScrollView>
        </View>
    )
}


export default Details