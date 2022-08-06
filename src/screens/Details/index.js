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
        console.log("getting video")
        setStatus('loading');
        try {
            const video = await TheFlixProvider.loadFlicks(movie.link, 'movie');
            setVideo(video.url);
            if(open_subtitle_token != ""){
                const subtitle = await opensubtitle.getSubtitle(movie, open_subtitle_token);
                if(subtitle){
                    setSubtitle(subtitle);
                }
            }
            setStatus('success');
        } catch (error) {
            setStatus('error');
        }
    }

    const getSeason = async () => {
        setStatus('loading');
        try {
            const season = await tmdb.get_seasons(movie.id);
            setSeasonData(season.seasons);
            selectedSeason(season.seasons[0]);
            setStatus('success');
        } catch (err) {
            setStatus('error');
        }
    }

    const getEpisodes = async () => {
        setStatus('loading');
        try {
            const episodes = await tmdb.get_episodes(movie.id, movie.title, selectedSeason.season_number);
            setEpisodeData(episodes);
            setSelectedEpisode(episodes[0]);
            setStatus('success');
        } catch (err) {
            setStatus('error');
        }
    }

    const getEpisodeLink = async () => {
        setStatus('loading');
        try {
            const link = await TheFlixProvider.loadFlicks(selectedEpisode.link, "tv");
            setVideo(link.url);
            if(open_subtitle_token != ""){
                const subtitle = await opensubtitle.getSubtitle(movie, opensubtitle_token, selectedSeason.season_number, selectedEpisode.episode_number);
                if(subtitle){
                    setSubtitle(subtitle);
                }
            }
            setStatus('success');
        } catch (err) {
            setStatus('error');
        }
    }

    ////////////// SOLAR FUNCTIONS ////////////////////////

    const getVideoSolar = async () => {
        setStatus('loading');
        try {
            const video = await SolarMovieProvider.loadFlicks(movie.link, "movie");
            setVideo(video.url)
            setSubtitle(video.subs[0].url);
            setStatus('success');
        } catch (error) {
            setStatus('error');
        }
    }

    const getSeasonSolar = async () => {
        setStatus('loading');
        try {
            const season = await solarmovie.get_tv_details(movie.id);
            setSeasonData(season?.seasons)
            setSelectedSeason(season?.seasons[0])
        } catch (err) {
            console.log(err)
        }
    }

    const getEpisodesSolar = async () => {
        setStatus('loading');
        try {
            const episodes = await solarmovie.get_episodes(movie.id, selectedSeason.id);
            setEpisodeData(episodes)
            setSelectedEpisode(episodes[0])
        } catch (err) {
            console.log(err)
        }
    }

    const getEpisodeLinkSolar = async () => {
        setStatus('loading');
        try {
            const episode = await SolarMovieProvider.loadFlicks(movie.link, "tv", selectedEpisode.id);
            if (episode) {
                console.log(episode.url)
                setTvLink(episode?.url)
                if(episode?.subs.lenght > 0){
                    setSubtitle(episode?.subs[0]?.url || "");
                }
                setStatus('success');
            }

        } catch (err) {
            console.log(err)
        }
    }


    ///////////////////////////////////////

    useEffect(() => {
        if (movie.type == "tv") {
            provider == "theflix" ? getEpisodes() : getEpisodesSolar();
        }
    }, [selectedSeason])

    useEffect(() => {
        if (movie.type == "tv") {
            provider == "theflix" ? getEpisodeLink() : getEpisodeLinkSolar();
        }
    }, [selectedEpisode])


    const test = async () => {
        const subtitle = await opensubtitle.getSubtitle(movie, opensubtitle_token);
    }
    useEffect(() => {
        if (provider == "theflix") {
            movie.type == "movie" ? getVideo() : getSeason();
        } else {
            movie.type == "movie" ? getVideoSolar() : getSeasonSolar();
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