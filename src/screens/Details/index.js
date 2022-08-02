import { View, Text, Image, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, sizes } from '~/constants/theme'
import MediaPlayer from '~/components/MediaPlayer'
import { ScrollView } from 'react-native-gesture-handler'
import TheFlixProvider from "~/providers/KrazyDevsScrapper/TheFlixProvider";
import SolarMovieProvider from "~/providers/KrazyDevsScrapper/SolarMovieProvider";
import TvDetails from '~/components/TvDetails'
import TvEpisodes from '~/components/TvEpisodes'
import solarmovie from '~/api/solarmovie'
import {
    startDownload
} from "~/helpers/useDownload"
import { useSelector } from 'react-redux'


const Details = ({ navigation, route }) => {
    const {
        provider,
        open_subtitle_token
    } = useSelector(state => state.profile)
    const { movie } = route.params;
    const [video, setVideo] = useState(null);
    const [status, setStatus] = useState('loading');
    const [seasonData, setSeasonData] = useState([]);
    const [episodeData, setEpisodeData] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState([]);
    const [selectedEpisode, setSelectedEpisode] = useState([]);
    const [tvLink, setTvLink] = useState("");
    const [subtitle, setSubtitle] = useState("")
    const [tvSelected, setTVSelected] = useState({
        season: 1,
        episode: 1
    });



    function onDownload() {
        console.log(status)
        startDownload(movie, video)
        if (status) {
            alert("Download has Started!");
        } else {
            alert("Error Downloading.. :(")
        }
    }

    ///////////   THE FLIX FUNCTIONS //////////////////

    const getVideo = async () => {
        setStatus('loading');
        try {
            const video = await TheFlixProvider.loadFlicks(movie.link, movie.type);
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


    ////////////// SOLAR FUNCTIONS ////////////////////////

    const getVideoSolar = async () => {
        setStatus('loading');
        console.log(movie.link)
        try {
            const video = await SolarMovieProvider.loadFlicks(movie.link, "movie");
            console.log(video);
            setVideo(video.url)
            setSubtitle(video.subs[0].url);
            setStatus('success');
        } catch (error) {
            setStatus('error');
        }
    }

    const getSeason = async () => {
        setStatus('loading');
        try {
            const season = await solarmovie.get_tv_details(movie.id);
            setSeasonData(season?.seasons)
            setSelectedSeason(season?.seasons[0])
        } catch (err) {
            console.log(err)
        }
    }

    const getEpisodes = async () => {
        setStatus('loading');
        try {
            const episodes = await solarmovie.get_episodes(movie.id, selectedSeason.id);
            setEpisodeData(episodes)
            setSelectedEpisode(episodes[0])
        } catch (err) {
            console.log(err)
        }
    }

    const getEpisodeLink = async () => {
        setStatus('loading');
        try {
            console.log(selectedEpisode)
            const episode = await SolarMovieProvider.loadFlicks(movie.link, "tv", selectedEpisode.id);
            if (episode) {
                setVideo(episode?.url)
                setSubtitle(episode?.subs[0]?.url);
                setStatus('success');
            }

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getEpisodes();
    }, [selectedSeason])

    useEffect(() => {
        getEpisodeLink();
    }, [selectedEpisode])

    useEffect(() => {
        // if(provider === "theflix"){
        //     movie.type == "movie" ? getVideo() : getTv();
        // }else{
            movie.type == "movie" ? getVideoSolar() : getSeason();
        // }
        // 
        // getVideoSolar();
        
        // getTVSolar();
        // open_subtitle_token != '' && searchSubs()
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
                                {movie?.description || "No Description"}
                            </Text>
                        </View>
                    </View>
                    {
                        movie.type === "tv" && (
                            <View>
                                <TvDetails
                                    setSelectedSeason={setSelectedSeason}
                                    selectedSeason={selectedSeason}
                                    seasonData={seasonData}
                                />
                                <TvEpisodes
                                    setSelectedEpisode={setSelectedEpisode}
                                    selectedEpisode={selectedEpisode}
                                    episodeData={episodeData}
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