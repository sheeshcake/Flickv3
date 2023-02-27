import { View, Text, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, sizes } from '~/constants/theme'
import MediaPlayer from '~/components/MediaPlayer'
import MovieList from '~/components/MovieList';
import { ScrollView } from 'react-native-gesture-handler'
// import providers here
import {
    loadFlickSolar,
    loadSeriesEpisodeSolar,
    loadFlickDetailsSolar,
    loadTvDataSolar,
    getRecommendedSolar
} from "~/providers/KrazyDevsScrapper/SolarMovieProvider";
import {
    loadFlickHQ,
    loadSeriesEpisodeHQ,
    loadTvDataHQ,
    getRecommendedHQ,
    loadFlickDetailsHQ
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
    const [episodeIndex, setEposodeIndex] = useState(0);
    const [video, setVideo] = useState(null);
    const [recommended, setRecommended] = useState([]);
    const [details, setDetails] = useState(null);
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
            console.log(error)
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
            if (episode) {
                const video = await loadSeriesEpisodeHQ(episode);
                setVideo(video.sources[0].url);
                setSubtitle(video.subtitles.find(sub => sub.lang.includes('English')).url);
            }
        } catch (err) {
            setStatus('error');
        }
    }

    const getDetailsHQ = async ()  => {
        const details = await loadFlickDetailsHQ(movie.id);
        const recommended = await getRecommendedHQ(movie.id);
        setDetails(details)
        setRecommended(recommended);
    }

    
    const getDetailsSolar = async ()  => {
        const recommended = await getRecommendedSolar(movie.id);
        const details = await loadFlickDetailsSolar(movie.id);
        setDetails(details);
        setRecommended(recommended);
    }


    useEffect(() => {
        if (movie.type == "tv" && selectedEpisode.id) {
            setVideo(null);
            switch (provider) {
                case "solarmovie":
                    getEpisodeVideoSolar(selectedEpisode.id);
                    break;
                case "flixhq":
                    getEpisodeVideoHQ(selectedEpisode.id);
                    break;
                default:
                    getEpisodeVideoHQ(selectedEpisode.id);
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
            case "solarmovie": {
                getDetailsSolar();
                if (movie.type == "tv") {
                    getEpisodesSolar();
                } else {
                    getVideoSolar();
                }
                break;
            }
            case "flixhq": {
                getDetailsHQ();
                if (movie.type == "tv") {
                    getEpisodesHQ();
                } else {
                    getVideoHQ();
                }
                break;
            }
            default:
                console.log("Retrying...")
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
                type={movie.type}
                status={status}
                setStatus={(d) => setStatus(d)}
                imageUrl={movie.image}
                navigation={navigation}
                subtitle={subtitle}
                onDownload={() => onDownload()}
                player_type={player_type}
                onNext={() => {
                    let Episodeindex = episodeData?.findIndex(x => x.id == selectedEpisode?.id)
                    let Seasonindex = seasonData?.findIndex(x => x.id == selectedSeason?.id)
                    if(Episodeindex >= 0 && Seasonindex >= 0){
                        Episodeindex += 1;
                        if(episodeData.length < Episodeindex - 1 ){
                            Seasonindex += 1
                            if(seasonData.length < Seasonindex -1 ){
                                Seasonindex - 1;
                            }
                            setSelectedSeason(seasonData?.[Seasonindex])
                            index = 0;
                        }
                        if(episodeData?.[Episodeindex]) {
                            setSelectedEpisode(episodeData?.[Episodeindex])
                        }
                    }
                }}
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
                            {details ? details?.mainData?.map((k) => {
                                return (
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "row",
                                            marginBottom: 3
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: colors.white,
                                                textTransform: 'capitalize'
                                            }}
                                        >{k?.name}: {k?.data != "" ? k?.data : "No Data"}</Text>
                                    </View>
                                )
                            }) :
                                <View style={{
                                    flex: 1,
                                    padding: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <ActivityIndicator size="large" color={colors.red} />
                                </View>
                            }
                        </View>
                    </View>
                    {details ? (<>
                        <View
                            style={{
                                marginTop: 10,
                                paddingHorizontal: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    marginBottom: 5,
                                    color: colors.white,
                                    fontWeight: 'bold',
                                }}
                            >
                                Description
                            </Text>
                            <Text
                                style={{
                                    color: colors.white,
                                }}
                            >
                                {details?.description || "No Description"}
                            </Text>
                        </View>
                        <View
                            style={{
                                marginTop: 10,
                                paddingHorizontal: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    marginBottom: 5,
                                    color: colors.white,
                                    fontWeight: 'bold',
                                }}
                            >
                                Country
                            </Text>
                            <Text
                                style={{
                                    color: colors.white,
                                }}
                            >
                                {details?.country || "No Data"}
                            </Text>
                        </View>

                        <View
                            style={{
                                marginTop: 10,
                                paddingHorizontal: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    marginBottom: 5,
                                    color: colors.white,
                                    fontWeight: 'bold',
                                }}
                            >
                                Production
                            </Text>
                            <Text
                                style={{
                                    color: colors.white,
                                }}
                            >
                                {details?.production || "No Data"}
                            </Text>
                        </View>
                    </>)
                    :
                        <View style={{
                            padding: 10,
                        }}>
                            <ActivityIndicator size="large" color={colors.red} />
                        </View>
                    
                    }
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
                                    isLoaded={video ? true : false}
                                />
                            </View>
                        )
                    }
                </View>
                {recommended?.length > 0 && <MovieList key={Math.floor(Math.random() * 10000) + 1} title="You May Also Like" movies={recommended} navigation={navigation} />}
            </ScrollView>
        </View>
    )
}


export default Details