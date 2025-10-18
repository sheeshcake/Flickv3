import { View, Text, Image, ActivityIndicator, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { colors, sizes } from '~/constants/theme';
import MediaPlayer from '~/components/MediaPlayer';
import MovieList from '~/components/MovieList';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import wyzieSubtitles from '~/api/wyzieSubtitles';


// Components and utilities
import TvDetails from '~/components/TvDetails';
import TvEpisodes from '~/components/TvEpisodes';
import TrailerPlayer from '~/components/TrailerPlayer';
import { startDownload } from '~/helpers/useDownload';
import tmdbApi from '~/api/tmdb';
import { useSelector } from 'react-redux';

const Details = ({ navigation, route }) => {
    const { player_type } = useSelector(state => state.profile);
    const { movie } = route.params;

    // State management
    const [video, setVideo] = useState(null);
    const [subtitle, setSubtitle] = useState('');
    const [recommended, setRecommended] = useState([]);
    const [details, setDetails] = useState(null);
    const [status, setStatus] = useState('loading');
    const [detailsLoading, setDetailsLoading] = useState(true);
    const [showPlayer, setShowPlayer] = useState(false);
    const [seasonData, setSeasonData] = useState([]);
    const [episodeData, setEpisodeData] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);
    const [message, setMessage] = useState('Loading..');
    const [shouldPauseVideo, setShouldPauseVideo] = useState(false);

    const fetchEpisodes = async (seasonId) => {
        const episodes = await tmdbApi.get_episodes(movie.id, seasonId);
        setEpisodeData(episodes);
    };

    const fetchTMDBDetails = async () => {
        setDetailsLoading(true);
        try {
            const data = await tmdbApi.get_movie_details(movie.id, movie.type);
            setDetails(data);
            setRecommended(data?.recommended || []);
            if (movie.type === 'movie'){
                fetchSubtitles();
            }
            if (movie.type === 'tv' && data.number_of_seasons > 0) {
                setSeasonData(data.seasons);
                setSelectedSeason(data.seasons[0]);
                fetchEpisodes(data.seasons[0].season_number);
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const fetchSubtitles = async () => {
        if(movie.type === 'movie'){
            const subs = await wyzieSubtitles.getMovieSubtitle(movie.id);
            setSubtitle(subs.url);
        } else if (movie.type === 'tv' && selectedEpisode) {
            const subs = await wyzieSubtitles.getTvShowSubtitle(movie.title, selectedSeason.season_number, selectedEpisode.episode_number);
            setSubtitle(subs.url);
        }
    };

    const onScraped = (videoUrl) => {
        console.log(videoUrl)
        setVideo(videoUrl);
    };

    const onPlayPressed = () => {
        setIsVideoPlaying(true);
        setShowPlayer(true);
        setStatus('playing');
    };

    const onBackButtonPress = () => {
        if (isVideoPlaying) {
            setIsVideoPlaying(false);
        }
        navigation.goBack();
    };

    const runScraper = async () => {
        setVideo(null);
        setStatus('loading');
        setMessage('Loading..');
    }

    useEffect(() => {
        fetchTMDBDetails();
        const interval = setInterval(() => {
            setMessage('Retrying..');
        }, 10000);
        setTimeout(() => {
            clearInterval(interval);
            setMessage('Unavailable');
        }, 60000);

    }, [movie.id, movie.type]);

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: colors.black,
                padding: 0,
            }}>
            {showPlayer ? (
                <MediaPlayer
                    video={video}
                    subtitle={subtitle}
                    isVideoPlaying={isVideoPlaying}
                    title={movie.title}
                    status={status}
                    setStatus={setStatus}
                    player_type={player_type}
                />
            ) : (
                <TrailerPlayer
                    trailerVideo={details?.trailer}
                    movieId={movie?.id}
                    season={selectedSeason?.season_number}
                    episode={selectedEpisode?.episode_number}
                    movieType={movie?.type}
                    movieImage={details?.backdrop_path}
                    onVideoScraped={onScraped}
                    onBackButtonPress={onBackButtonPress}
                />
            )}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                <Image
                    source={{ uri: movie.image }}
                    style={{
                        width: sizes.width * 0.30,
                        height: sizes.width * 0.50,
                        borderRadius: 10,
                        marginHorizontal: 10,
                    }}
                />
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginTop: 10,
                    }}>
                    <Text
                        style={{
                            fontSize: movie.title.length > 20 ? 20 : 30,
                            fontWeight: 'bold',
                            color: colors.white,
                        }}>
                        {movie.title}
                    </Text>
                    {details ? (
                        <>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: colors.white,
                                    paddingBottom: 5,
                                }}>
                                {details?.release_date
                                    ? `Release Date: ${details.release_date}`
                                    : 'Release Date: N/A'}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: colors.white,
                                    paddingBottom: 5,
                                }}>
                                {details?.rating
                                    ? `Rating: ${details.rating}`
                                    : 'Rating: N/A'}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: colors.white,
                                    paddingBottom: 5,
                                }}>
                                {details?.genres && details.genres.length > 0
                                    ? `Genres: ${details.genres
                                        .map(genre => genre.name)
                                        .join(', ')}`
                                    : 'Genres: N/A'}
                            </Text>
                        </>
                    ) : detailsLoading ? (
                        <View
                            style={{
                                flex: 1,
                                padding: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <ActivityIndicator size="large" color={colors.red} />
                        </View>
                    ) : (
                        <Text style={{ color: colors.white }}>No details available</Text>
                    )}
                    {!showPlayer && movie.type !== 'tv' && (
                        <TouchableOpacity
                            onPress={onPlayPressed}
                            style={{
                                backgroundColor: message === 'Unavailable' ? colors.grey : colors.white,
                                padding: 10,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                marginTop: 10,
                                width: sizes.width * 0.3,
                                alignSelf: 'center',
                                marginBottom: 5,
                            }}
                            disabled={!video}
                        >
                            {video ? (
                                <>
                                    <Icon name="play" size={20} color={colors.black} />
                                    <Text style={{ color: colors.black, marginLeft: 5 }}>Play</Text>
                                </>
                            ) : (
                                <>
                                    {message === 'Unavailable' ? (
                                        <Icon name="close-circle" size={20} color={colors.black} />
                                    ) : (
                                        <ActivityIndicator size="small" color={colors.black} />
                                    )}
                                    <Text style={{ color: colors.black, marginLeft: 5 }}>{message}</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View
                style={{
                    padding: sizes.padding,
                    marginTop: 20,
                    flex: 1,
                }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {details ? (
                        <>
                            <View
                                style={{
                                    paddingHorizontal: 5,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        marginBottom: 5,
                                        color: colors.white,
                                        fontWeight: 'bold',
                                    }}>
                                    Description
                                </Text>
                                <Text
                                    style={{
                                        color: colors.white,
                                    }}>
                                    {details?.description || 'No Description'}
                                </Text>
                            </View>
                            <View
                                style={{
                                    marginTop: 10,
                                    paddingHorizontal: 5,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        marginBottom: 5,
                                        color: colors.white,
                                        fontWeight: 'bold',
                                    }}>
                                    Country
                                </Text>
                                <Text
                                    style={{
                                        color: colors.white,
                                    }}>
                                    {details?.country || 'No Data'}
                                </Text>
                            </View>

                            <View
                                style={{
                                    marginTop: 10,
                                    paddingHorizontal: 5,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        marginBottom: 5,
                                        color: colors.white,
                                        fontWeight: 'bold',
                                    }}>
                                    Production
                                </Text>
                                <Text
                                    style={{
                                        color: colors.white,
                                    }}>
                                    {details?.production || 'No Data'}
                                </Text>
                            </View>
                        </>
                    ) : detailsLoading ? (
                        <View
                            style={{
                                padding: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <ActivityIndicator size="large" color={colors.red} />
                            <Text style={{ color: colors.white, marginTop: 10 }}>
                                Loading details...
                            </Text>
                        </View>
                    ) : (
                        <Text style={{ color: colors.white, padding: 10 }}>
                            No additional details available
                        </Text>
                    )}
                    {movie.type === 'tv' && (
                        <View>
                            <TvDetails
                                setSelectedSeason={(season) => {
                                    setSelectedSeason(season);
                                    fetchEpisodes(season.season_number);
                                }}
                                selectedSeason={selectedSeason}
                                seasonData={seasonData}
                            />
                            <TvEpisodes
                                setSelectedEpisode={(episode) => {
                                    setShowPlayer(true);
                                    setSelectedEpisode(episode);
                                    runScraper();
                                }}
                                selectedEpisode={selectedEpisode}
                                episodeData={episodeData}
                                isLoaded={true}
                            />
                        </View>
                    )}
                    {recommended && (
                        <MovieList
                            key={Math.floor(Math.random() * 10000) + 1}
                            title="You May Also Like"
                            movies={recommended}
                            navigation={navigation}
                        />
                    )}
                </ScrollView>
            </View>
        </View >
    );
};

export default Details;
