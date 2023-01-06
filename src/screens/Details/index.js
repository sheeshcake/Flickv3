import { View, Text, Image, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, sizes } from '~/constants/theme'
import MediaPlayer from '~/components/MediaPlayer'
import { ScrollView } from 'react-native-gesture-handler'
// import providers here
import {
    loadFlickSolar,
    loadSeriesEpisodeSolar,
    loadTvDataSolar
} from "~/providers/KrazyDevsScrapper/SolarMovieProvider";
import {
    loadFlickHQ,
    loadSeriesEpisodeHQ,
    loadTvDataHQ
} from "~/providers/KrazyDevsScrapper/FlixHQProvider";

////////
import TvDetails from '~/components/TvDetails'
import TvEpisodes from '~/components/TvEpisodes'
import opensubtitle from '~/api/opensubtitle'
import tmdb from '~/api/tmdb'
import {
    startDownload
} from "~/helpers/useDownload"
import { useSelector } from 'react-redux'


const Details = ({ navigation, route }) => {
    const {
        provider,
        open_subtitle_token,
        player_type
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


    function onDownload() {
        startDownload(movie, video)
        if (status) {
            alert("Download has Started!");
        } else {
            alert("Error Downloading.. :(")
        }
    }

    ////////////// SOLAR FUNCTIONS ////////////////////////
    const getVideoSolar = async () => {
        setStatus('loading');
        try {
            const video = await loadFlickSolar(movie.id);
            setVideo(video.sources[0].url);
            setSubtitle(video.subtitles.find(sub => sub.lang.includes('English')).url);
        } catch (error) {
            setStatus('error');
        }
    }

    const getEpisodesSolar = async () => {
        setStatus('loading');
        try {
            const episodes = await loadTvDataSolar(movie.id);
            setSeasonData(episodes);
            setEpisodeData(episodes[0].episodes);
            setSelectedSeason(episodes[0]);
            setSelectedEpisode(episodes[0].episodes[0]);
        } catch (err) {
            setStatus('error');
        }
    }


    const getEpisodeVideoSolar = async (episode) => {
        setStatus('loading');
        try {
            const video = await loadSeriesEpisodeSolar(episode);
            setVideo(video.sources[0].url);
            setSubtitle(video.subtitles.find(sub => sub.lang.includes('English')).url);
        } catch (err) {
            setStatus('error');
        }
    }


    ///////////////////////////////////////

    ////////////// FLIXHQ FUNCTIONS ////////////////////////

    const getVideoHQ = async () => {
        setStatus('loading');
        try {
            const video = await loadFlickHQ(movie.id);
            setVideo(video.sources[0].url);
            setSubtitle(video.subtitles.find(sub => sub.lang.includes('English')).url);
        } catch (error) {
            setStatus('error');
        }
    }


    const getEpisodesHQ = async () => {
        setStatus('loading');
        try {
            const episodes = await loadTvDataHQ(movie.id);
            setSeasonData(episodes);
            setEpisodeData(episodes[0].episodes);
            setSelectedSeason(episodes[0]);
            setSelectedEpisode(episodes[0].episodes[0]);
        } catch (err) {
            setStatus('error');
        }
    }


    const getEpisodeVideoHQ = async (episode) => {
        setStatus('loading');
        try {
            const video = await loadSeriesEpisodeHQ(episode);
            setVideo(video.sources[0].url);
            setSubtitle(video.subtitles.find(sub => sub.lang.includes('English')).url);
        } catch (err) {
            setStatus('error');
        }
    }


    useEffect(() => {
        if (movie.type == "tv") {
            switch (provider) {
                case "solarmovie":
                    getEpisodeVideoSolar(selectedEpisode.id);
                    break;
                case "flixhq":
                    getEpisodeVideoHQ(selectedEpisode.id);
                    break;
                default:
                    alert('An error Occured!')
                    break;
            }
        }
    }, [selectedEpisode])

    useEffect(() => {
        if (movie.type == "tv") {
            setEpisodeData(selectedSeason.episodes);
        }
    }, [selectedSeason])

    const test = async () => {
        const subtitle = await opensubtitle.getSubtitle(movie, opensubtitle_token);
    }
    useEffect(() => {
        switch (provider) {
            case "solarmovie":{
                if (movie.type == "tv") {
                    getEpisodesSolar();
                } else { 
                    getVideoSolar();
                }
                break;
            }
            case "flixhq":{
                if (movie.type == "tv") {
                    getEpisodesHQ();
                } else {
                    getVideoHQ();
                }
                break;
            }
            default:
                alert('An error Occured!')
                break;
        }
    }, [])


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
                player_type={player_type}
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
                                    color: colors.white,
                                    paddingBottom: 5,
                                }}
                            >{movie.title}</Text>
                            <Text
                                style={{
                                    color: colors.white,
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