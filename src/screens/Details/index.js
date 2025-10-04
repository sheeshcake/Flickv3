import { View, Text, Image, ActivityIndicator, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { colors, sizes } from '~/constants/theme';
import MediaPlayer from '~/components/MediaPlayer';
import MovieList from '~/components/MovieList';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import * as wyzieSubtitles from '~/api/wyzieSubtitles';

// Vidking provider and WebView scrapper
import {
  loadFlickVidking,
  loadTvDataVidking,
  loadSeriesEpisodeVidking,
  getRecommendedVidking,
  getDetailsVidking,
} from '~/providers/KrazyDevsScrapper/VidkingProvider';
import WebViewScrapper from '~/providers/KrazyDevsScrapper/WebViewScrapper';

// Components and utilities
import TvDetails from '~/components/TvDetails';
import TvEpisodes from '~/components/TvEpisodes';
import { startDownload } from '~/helpers/useDownload';
import { useSelector } from 'react-redux';

const Details = ({ navigation, route }) => {
  const { player_type } = useSelector(state => state.profile);
  const { movie } = route.params;

  // State management
  const [video, setVideo] = useState(null);
  const [subtitle, setSubtitle] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [status, setStatus] = useState('loading');
  const [seasonData, setSeasonData] = useState([]);
  const [episodeData, setEpisodeData] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [showWebViewScrapper, setShowWebViewScrapper] = useState(false);
  const [scrapperUrl, setScrapperUrl] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [shouldPauseVideo, setShouldPauseVideo] = useState(false);

  // Animation for pulsing logo
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Download functionality
  const onDownload = () => {
    startDownload(movie, video);
    if (video) {
      alert('Download has Started!');
    } else {
      alert('Error Downloading.. :(');
    }
  };

  // Vidking provider functions
  const getVideoVidking = async () => {
    try {
      setStatus('loading');
      const videoData = await loadFlickVidking(movie.id);
      if (videoData?.sources?.[0]?.url) {
        setScrapperUrl(videoData.sources[0].url);
        setShowWebViewScrapper(true);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const getEpisodesVidking = async () => {
    try {
      setStatus('loading');
      const episodes = await loadTvDataVidking(movie.id);

      if (episodes?.length > 0 && episodes[0]?.episodes?.length > 0) {
        setSeasonData(episodes);
        setEpisodeData(episodes[0].episodes);
        setSelectedSeason(episodes[0]);
        setSelectedEpisode(episodes[0].episodes[0]);

        // Load the first episode
        await getEpisodeVideoVidking(episodes[0].episodes[0]);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const getEpisodeVideoVidking = async episode => {
    try {
      setStatus('loading');
      // Reset video and subtitle data for new episode
      setVideo(null);
      setSubtitle(null);

      const videoData = await loadSeriesEpisodeVidking(episode);

      if (videoData?.sources?.[0]?.url) {
        const newUrl = videoData.sources[0].url;
        setScrapperUrl(newUrl);
        setShowWebViewScrapper(true);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const loadDetailsVidking = async () => {
    try {
      setDetailsLoading(true);

      // Get details first using the imported function
      const details = await getDetailsVidking(movie.id, movie.type);
      setDetails(details);
      setDetailsLoading(false);

      // Get recommended content separately
      try {
        const recommended = await getRecommendedVidking(movie.id, movie.type);
        setRecommended(recommended);
      } catch (recError) {
        setRecommended([]);
      }
    } catch (error) {
      // Set fallback details to prevent infinite loading
      setDetails({
        description: movie.overview || 'No description available',
        mainData: [{ name: 'Title', data: movie.title || 'Unknown' }],
      });
      setDetailsLoading(false);
      setRecommended([]);
    }
  };

  // Handle WebViewScrapper data extraction - simplified
  const handleDataExtracted = data => {
    if (data?.video) {
      setVideo(data.video);
      setStatus('success');
      setShowWebViewScrapper(false);
    }

    setIsVideoPlaying(true);
  };

  const handleScrapperLoading = loading => {
    // No action needed
  };

  useEffect(() => {
    if (movie.type === 'tv' && selectedEpisode?.id) {
      // Reset all video-related states when episode changes
      setVideo(null);
      setSubtitle(null);
      setShowWebViewScrapper(false);
      setScrapperUrl('');
      setStatus('loading');

      // Small delay to ensure state is reset before starting new scraping
      setTimeout(() => {
        getEpisodeVideoVidking(selectedEpisode);
        fetchWyzieSubtitles();
      }, 100);
    }
  }, [selectedEpisode]);

  // Fetch subtitles using wyzie-lib
  const fetchWyzieSubtitles = async () => {
    try {
      let subtitle = null;

      if (movie.type === 'tv') {
        // Make sure we have all required data for TV show subtitles
        if (!selectedSeason || !selectedEpisode) {
          return;
        }

        // Extract season and episode numbers, with fallbacks
        // Try different property names that might exist in the API response
        const seasonNumber = selectedSeason?.season_number ||
          selectedSeason?.seasonNumber ||
          selectedSeason?.season ||
          (selectedSeason?.name ? parseInt(selectedSeason.name.replace(/\D/g, '')) : null);

        const episodeNumber = selectedEpisode?.episode_number ||
          selectedEpisode?.episodeNumber ||
          selectedEpisode?.episode ||
          (selectedEpisode?.name ? parseInt(selectedEpisode.name.replace(/\D/g, '')) : null);

        if (!seasonNumber || !episodeNumber) {
          return;
        }

        // Fetch TV show subtitle
        subtitle = await wyzieSubtitles.getTvSubtitle(
          movie.id,
          seasonNumber,
          episodeNumber,
          { language: 'en' }
        );
      } else {
        // Fetch movie subtitle
        subtitle = await wyzieSubtitles.getMovieSubtitle(
          movie.id,
          { language: 'en' }
        );
      }

      if (subtitle) {
        if (subtitle.vttContent) {
          // Use the VTT content directly if available
          setSubtitle(subtitle.vttContent);
        } else if (subtitle.url) {
          setSubtitle(subtitle.url);
        }
      }
    } catch (error) {
      // Silent error handling
    }
  };

  // Handle season selection for TV shows
  useEffect(() => {
    if (movie.type === 'tv' && selectedSeason?.episodes) {
      setEpisodeData(selectedSeason.episodes);
      // Don't fetch subtitles here - wait for episode selection
    }
  }, [selectedSeason]);

  // Handle episode selection for TV shows
  useEffect(() => {
    if (movie.type === 'tv' && selectedEpisode) {
      // Fetch subtitles when an episode is selected
      fetchWyzieSubtitles();
    }
  }, [selectedEpisode]);

  // Pulsing animation effect
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [pulseAnim, video]);

  // Initial data loading
  useEffect(() => {
    loadDetailsVidking();

    if (movie.type === 'tv') {
      getEpisodesVidking();
      // Don't fetch TV subtitles here - wait for episode selection
    } else {
      getVideoVidking();
      // Fetch wyzie subtitles for movies
      fetchWyzieSubtitles();
    }
  }, []);

  // Handle screen focus/blur to pause/resume video
  useFocusEffect(
    React.useCallback(() => {
      // When screen comes into focus, allow video to play
      setShouldPauseVideo(false);
      setIsVideoPlaying(true);

      return () => {
        // When screen loses focus (navigating away), pause the video
        setShouldPauseVideo(true);
        setIsVideoPlaying(false);
      };
    }, [])
  );

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.black,
        padding: 0,
      }}>
      {showWebViewScrapper && scrapperUrl ? (
        <View style={{ height: 255, width: '100%', position: 'relative' }}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            }}>
            {/* Background movie image */}
            <Image
              source={{ uri: movie.image }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              resizeMode="cover"
            />

            {/* Gradient overlay - transparent to black (bottom gradient) */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,1)']}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />

            <LinearGradient
              colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0.4)', 'transparent']}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />

            {/* Loading overlay with pulsing Flick logo */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}>
              <Animated.View
                style={{
                  opacity: pulseAnim,
                  transform: [{ scale: pulseAnim }],
                }}>
                <Image
                  source={require('~/assets/logo/logo.png')}
                  style={{
                    width: 100,
                    height: 200,
                  }}
                  resizeMode="contain"
                />
              </Animated.View>
            </View>

            {/* Back button overlay */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 70,
                zIndex: 9999,
                pointerEvents: 'box-none',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 50,
                  paddingHorizontal: 10,
                  backgroundColor: 'transparent',
                }}
                pointerEvents="box-none">
                <TouchableOpacity
                  onPress={() => {
                    setShouldPauseVideo(true);
                    setIsVideoPlaying(false);
                    navigation.navigate('Tabs');
                  }}
                  style={{
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                  activeOpacity={0.7}>
                  <Icon
                    name="arrow-left"
                    size={sizes.width * 0.05}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <WebViewScrapper
            key={`${selectedEpisode?.id || 'movie'}-${scrapperUrl}`}
            websiteUrl={scrapperUrl}
            onDataExtracted={handleDataExtracted}
            onLoading={handleScrapperLoading}
          />
        </View>
      ) : video && subtitle && !showWebViewScrapper ? (
        <MediaPlayer
          title={movie.title}
          video={video}
          movie={movie}
          type={movie.type}
          status={status}
          setStatus={setStatus}
          imageUrl={movie.image}
          navigation={navigation}
          subtitle={subtitle}
          onDownload={onDownload}
          player_type={player_type}
          shouldPauseVideo={shouldPauseVideo}
          isVideoPlaying={isVideoPlaying}
          setIsVideoPlaying={setIsVideoPlaying}
          onNext={() => {
            const episodeIndex = episodeData?.findIndex(
              x => x.id === selectedEpisode?.id,
            );
            const seasonIndex = seasonData?.findIndex(
              x => x.id === selectedSeason?.id,
            );

            if (episodeIndex >= 0 && seasonIndex >= 0) {
              const nextEpisodeIndex = episodeIndex + 1;

              if (nextEpisodeIndex < episodeData?.length) {
                // Next episode in current season
                setSelectedEpisode(episodeData[nextEpisodeIndex]);
              } else if (seasonIndex + 1 < seasonData?.length) {
                // First episode of next season
                const nextSeason = seasonData[seasonIndex + 1];
                setSelectedSeason(nextSeason);
                if (nextSeason?.episodes?.length > 0) {
                  setSelectedEpisode(nextSeason.episodes[0]);
                }
              }
            }
          }}
        />
      ) : status === 'loading' ? (
        <View
          style={{
            height: 235,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.black,
          }}>
          <ActivityIndicator size="large" color={colors.red} />
          <Text style={{ color: colors.white, marginTop: 10 }}>
            Loading video...
          </Text>
        </View>
      ) : status === 'error' ? (
        <View
          style={{
            height: 235,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.black,
          }}>
          <Text style={{ color: colors.white, fontSize: 16 }}>
            No video available
          </Text>
          <TouchableOpacity
            onPress={() => {
              setStatus('loading');
              if (movie.type === 'tv' && selectedEpisode) {
                getEpisodeVideoVidking(selectedEpisode);
              } else {
                getVideoVidking();
              }
            }}
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: colors.red,
              borderRadius: 5,
            }}>
            <Text style={{ color: colors.white }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginTop: 20,
        }}>
        <View
          style={{
            padding: sizes.padding,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
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
                flexDirection: 'column',
                alignItems: 'flex-start',
                paddingTop: 15,
                marginHorizontal: 10,
              }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: colors.white,
                  paddingBottom: 5,
                }}>
                {movie.title}
              </Text>
              {details ? (
                details?.mainData?.map((k, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginBottom: 3,
                      }}>
                      <Text
                        style={{
                          color: colors.white,
                          textTransform: 'capitalize',
                        }}>
                        {k?.name}: {k?.data != '' ? k?.data : 'No Data'}
                      </Text>
                    </View>
                  );
                })
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
            </View>
          </View>
          {details ? (
            <>
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
              <Text style={{ color: colors.white, marginTop: 10 }}>Loading details...</Text>
            </View>
          ) : (
            <Text style={{ color: colors.white, padding: 10 }}>No additional details available</Text>
          )}
          {movie.type === 'tv' &&
            (console.log('SeasonData:', seasonData),
              (
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
              ))}
        </View>
        {recommended?.length > 0 && (
          <MovieList
            key={Math.floor(Math.random() * 10000) + 1}
            title="You May Also Like"
            movies={recommended}
            navigation={navigation}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default Details;
