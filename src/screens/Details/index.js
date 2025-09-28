import { View, Text, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, sizes } from '~/constants/theme'
import MediaPlayer from '~/components/MediaPlayer'
import MovieList from '~/components/MovieList';
import { WebView } from 'react-native-webview';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
import {
    getVegaDetails,
    getVegaStreams,
    loadFlickVega,
    loadFlickDetailsVega,
    loadTvDataVega,
    loadSeriesEpisodeVega,
    getRecommendedVega
} from "~/providers/KrazyDevsScrapper/VegaProvider";

import {
    getheroVidking,
    getgenreVidking,
    loadFlickVidking,
    loadTvDataVidking,
    loadSeriesEpisodeVidking,
    getRecommendedVidking,
    getDetailsVidking
} from "~/providers/KrazyDevsScrapper/VidkingProvider";

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

    const getDetailsVega = async () => {
        const details = await loadFlickDetailsVega(movie.url || movie.link);
        const recommended = await getRecommendedVega();
        setDetails(details);
        setRecommended(recommended);
    }

    const getVideoVega = async () => {
        try {
            setStatus('loading');
            const videoLink = await loadFlickVega(movie.url || movie.link, 'movie');
            setVideo(videoLink);
            setStatus('success');
        } catch (error) {
            console.error('Error getting Vega video:', error);
            setStatus('error');
        }
    }

    const getEpisodesVega = async () => {
        try {
            const tvData = await loadTvDataVega(movie.url || movie.link);
            setSeasons(tvData.seasons);
            if (tvData.seasons.length > 0) {
                setSelectedSeason(tvData.seasons[0]);
            }
        } catch (error) {
            console.error('Error getting Vega episodes:', error);
        }
    }

    // Vidking provider functions
const getVideoVidking = async () => {
    try {
        setStatus('loading');
        console.log('Getting Vidking video for:', movie.id);
        const videoLink = await loadFlickVidking(movie.id);
        console.log('Vidking video URL:', videoLink); // Log the m3u8 URL to console
        setVideo(videoLink.sources[0].url);
        setStatus('success');
    } catch (error) {
        console.error('Error getting Vidking video:', error);
        setStatus('error');
    }
}

const getEpisodesVidking = async () => {
    try {
        setStatus('loading');
        console.log('Getting Vidking episodes for:', movie.id);
        const episodes = await loadTvDataVidking(movie.id);
        
        if (episodes && episodes.length > 0 && episodes[0].episodes && episodes[0].episodes.length > 0) {
            setSeasonData(episodes);
            setEpisodeData(episodes[0].episodes);
            setSelectedSeason(episodes[0]);
            setSelectedEpisode(episodes[0].episodes[0]);
            
            // Load the first episode
            await getEpisodeVideoVidking(episodes[0].episodes[0]);
        } else {
            console.error('No episodes found for TV show');
            setStatus('error');
        }
    } catch (error) {
        console.error('Error getting Vidking episodes:', error);
        setStatus('error');
    }
}

const getEpisodeVideoVidking = async (episode) => {
    try {
        setStatus('loading');
        console.log('Getting Vidking episode video for:', episode);
        const videoData = await loadSeriesEpisodeVidking(episode);
        console.log('Vidking episode URL:', videoData.sources[0].url); // Log the m3u8 URL to console
        setVideo(videoData.sources[0].url);
        setStatus('success');
    } catch (error) {
        console.error('Error getting Vidking episode video:', error);
        setStatus('error');
    }
}

const getDetailsVidkingLocal = async () => {
    try {
        console.log('Getting Vidking details for:', movie.id, movie.type);
        const details = await getDetailsVidking(movie.id, movie.type);
        const recommended = await getRecommendedVidking(movie.id);
        setDetails(details);
        setRecommended(recommended);
    } catch (error) {
        console.error('Error getting Vidking details:', error);
        // Set fallback details to prevent infinite loading
        setDetails({
            description: movie.overview || 'No description available',
            mainData: [
                { name: 'Title', data: movie.title || 'Unknown' }
            ]
        });
        setRecommended([]);
    }
}

const getEpisodeVideoVega = async (episodeId) => {
        try {
            setStatus('loading');
            const videoLink = await loadSeriesEpisodeVega(episodeId);
            setVideo(videoLink);
            setStatus('success');
        } catch (error) {
            console.error('Error getting Vega episode video:', error);
            setStatus('error');
        }
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
                case "vega":
                    getEpisodeVideoVega(selectedEpisode.id);
                    break;
                case "vidking":
                    getEpisodeVideoVidking(selectedEpisode);
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
            case "vega": {
                getDetailsVega();
                if (movie.type == "tv") {
                    getEpisodesVega();
                } else {
                    getVideoVega();
                }
                break;
            }
            case "vidking": {
                // For Vidking provider
                getDetailsVidkingLocal();
                if (movie.type == "tv") {
                    getEpisodesVidking();
                } else {
                    getVideoVidking();
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
            { provider === 'vidking' ?
            <View style={{ height: 300, width: '100%', position: 'relative' }}>
                {video ? (
                    <>
                        <WebView
                            source={{ uri: video }}
                            style={{ flex: 1, height: 300, width: '100%' }}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            startInLoadingState={true}
                            allowsInlineMediaPlayback={true}
                            mediaPlaybackRequiresUserAction={false}
                            allowsFullscreenVideo={true}
                            onError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.error('WebView error:', nativeEvent);
                            }}
                            onLoadStart={() => console.log('WebView loading started')}
                            onLoadEnd={() => console.log('WebView loading finished')}
                        />
                        {/* Back button overlay with better positioning */}
                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 70,
                                zIndex: 9999,
                                pointerEvents: 'box-none',
                            }}
                        >
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center', height: 50, paddingHorizontal: 10, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                                pointerEvents="box-none"
                            >
                                {/* Back button with fixed dimensions and better styling */}
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log('Back button pressed');
                                        navigation.navigate("Tabs");
                                    }}
                                    style={{
                                        padding: 10,
                                        alignItems: 'center',
                                        justifyContent: 'flex-start'
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Icon
                                        name="arrow-left"
                                        size={sizes.width * 0.05}
                                        color={colors.white}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                ) : (
                    <View style={{ 
                        flex: 1, 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        backgroundColor: colors.black 
                    }}>
                        <Text style={{ color: colors.white }}>Loading video...</Text>
                    </View>
                )}
            </View>
            :
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
            />}
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
                            console.log('SeasonData:', seasonData),
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