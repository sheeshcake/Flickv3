import {View, Text, Image, StatusBar, BackHandler} from 'react-native';
import React from 'react';
import Video from 'react-native-video';
import {TextTrackType} from 'react-native-video';
import {colors, sizes} from '~/constants/theme';
import {Immersive} from 'react-native-immersive';
import Orientation from 'react-native-orientation-locker';
import Controls from './Controls';
import VideoPlayer from 'react-native-reanimated-player';
import {useSharedValue} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//import CastButton from './CastButton';
import GoogleCast, {
  useDevices,
  useRemoteMediaClient,
  CastButton,
} from 'react-native-google-cast';
import {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { addOrUpdateItem } from '~/redux/continueWatchingSlice';
import { continueWatchingStorage } from '~/helpers/continueWatchingStorage';

const MediaPlayer = ({
  video,
  status,
  title,
  type,
  movie,
  imageUrl,
  setStatus,
  onDownload,
  subtitle,
  navigation,
  player_type,
  onNext,
  shouldPauseVideo,
  isVideoPlaying,
  setIsVideoPlaying,
  initialFullscreen = false,
  onFullscreenChange,
  seasonNumber,
  episodeNumber,
  episodeTitle,
  initialSeekTime = 0,
}) => {
  const dispatch = useDispatch();
  const [controlsHide, setControlsHide] = React.useState(false);
  const [playing, setPlaying] = React.useState(true);
  const [paused, setPaused] = React.useState(false);
  const [currentPosition, setCurrentPosition] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(initialSeekTime);
  const [fullscreen, setFullscreen] = React.useState(initialFullscreen);
  const [resize, setResize] = React.useState(1);
  const [isReadyNext, setIsReadyNext] = React.useState(false);
  const videoHeight = useSharedValue(sizes.width * (9 / 16));
  const isFullScreen = useSharedValue(false);
  const client = useRemoteMediaClient();
  const devices = useDevices();
  const [hasSeekInitial, setHasSeekInitial] = React.useState(false);
  const videoRef = React.useRef(null);
  const currentPositionRef = React.useRef(currentPosition);
  const durationRef = React.useRef(duration);

  // Debug log for video prop changes
  useEffect(() => {
    console.log('MediaPlayer video prop changed:', {
      video,
      hasVideo: !!video,
      videoType: typeof video,
      status
    });
  }, [video, status]);

  // Update refs when values change
  useEffect(() => {
    currentPositionRef.current = currentPosition;
  }, [currentPosition]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  // Seek to initial time when video loads
  useEffect(() => {
    if (initialSeekTime > 0 && duration > 0 && !hasSeekInitial && videoRef.current) {
      videoRef.current.seek(initialSeekTime);
      setCurrentTime(initialSeekTime);
      setCurrentPosition(initialSeekTime);
      setHasSeekInitial(true);
    }
  }, [initialSeekTime, duration, hasSeekInitial]);

  // Save continue watching progress periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const pos = currentPositionRef.current;
      const dur = durationRef.current;
      
      if (dur > 0 && pos > 10 && pos < dur - 30) {
        console.log('Saving continue watching progress...', pos, dur);
        // Only save if video has meaningful progress (more than 10 seconds watched and not near the end)
        const watchData = {
          id: movie.id,
          title: movie.title || title,
          type: type || movie.type || 'movie',
          poster: movie.image || imageUrl,
          progress: pos,
          duration: dur,
          overview: movie.overview,
        };

        // Add TV show specific data
        if (type === 'tv' && seasonNumber && episodeNumber) {
          watchData.seasonNumber = seasonNumber;
          watchData.episodeNumber = episodeNumber;
          watchData.episodeTitle = episodeTitle;
        }

        dispatch(addOrUpdateItem(watchData));
        
        // Save to AsyncStorage
        continueWatchingStorage.load().then(items => {
          const existingIndex = items.findIndex(item => {
            if (watchData.type === 'tv') {
              return item.id === watchData.id && 
                     item.seasonNumber === watchData.seasonNumber && 
                     item.episodeNumber === watchData.episodeNumber;
            }
            return item.id === watchData.id;
          });

          if (existingIndex !== -1) {
            items[existingIndex] = watchData;
          } else {
            items.unshift(watchData);
          }

          // Keep only last 20 items
          if (items.length > 20) {
            items = items.slice(0, 20);
          }

          continueWatchingStorage.save(items);
        });
      }
    }, 10000); // Save every 10 seconds

    return () => clearInterval(saveInterval);
  }, [movie, title, type, imageUrl, dispatch, seasonNumber, episodeNumber, episodeTitle]);

  // Restore fullscreen state when component mounts if needed
  useEffect(() => {
    if (initialFullscreen) {
      Orientation.lockToLandscape();
      Immersive.setImmersive(true);
      StatusBar.setHidden(true, 'fade');
      setFullscreen(true);
    } else {
      Orientation.lockToPortrait();
    }
    
    return () => {
      // Only reset to portrait if not in fullscreen mode
      if (!fullscreen) {
        Orientation.lockToPortrait();
      }
    };
  }, []);

  useEffect(() => {
    if (client) {
      client.loadMedia({
        mediaInfo: {
          contentUrl: video,
          contentType: 'video/mp4',
          metadata: {
            images: [
              {
                url: imageUrl,
              },
            ],
            title: title,
            subtitle: subtitle,
          },
          streamDuration: duration, // seconds
        },
        startTime: currentTime, // seconds
      });
    }
  }, [client, devices]);

  // Effect to handle external pause/resume commands
  useEffect(() => {
    if (shouldPauseVideo) {
      setPlaying(false);
      if (setIsVideoPlaying) {
        setIsVideoPlaying(false);
      }
    } else if (isVideoPlaying !== undefined) {
      setPlaying(isVideoPlaying);
    }
  }, [shouldPauseVideo, isVideoPlaying, setIsVideoPlaying]);

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Pause video when component unmounts
      setPlaying(false);
      if (setIsVideoPlaying) {
        setIsVideoPlaying(false);
      }
    };
  }, [setIsVideoPlaying]);

  const startCast = (
    video,
    image,
    title,
    subtitle,
    duration,
    currentTime,
    mediaType,
    moreDetails,
  ) => {
    try {
      GoogleCast.castMedia({
        mediaUrl: video, // Stream media video uri
        imageUrl: image, // Image video representative uri
        title, // Media main title
        subtitle, // Media subtitle
        studio: 'Asap Developers', // Media or app owner
        streamDuration: duration, // Stream duration in seconds
        contentType: mediaType, // Optional media type, default is 'video/mp4'
        playPosition: currentTime, // Stream play position in seconds
        customData: {
          // Optional, your custom objec6t that will be passed to as customData to reciever
          mediaDetails: moreDetails,
        },
      })
        .then(console.log('Playing.. '))
        .catch(e => console.log('An error has ocurred, reason: ', e));
    } catch (error) {
      console.log('An error has ocurred, reason: ', error);
    }
  };

  const onPause = () => {
    setPlaying(false);
    if (setIsVideoPlaying) {
      setIsVideoPlaying(false);
    }
  };

  const handleLoad = ({duration: mediaDuration}) => {
    console.log('Video loaded successfully, duration:', mediaDuration);
    setDuration(mediaDuration);
  };

  const onPlay = () => {
    console.log('MediaPlayer onPlay called, video URL:', video);
    setPlaying(true);
    if (setIsVideoPlaying) {
      setIsVideoPlaying(true);
    }
  };

  const checkTime = time => {
    // const percent = ((duration - time) / duration) * 100;
    // console.log(percent.toFixed(2) + "%");
    //console.log((duration - time).toFixed(0) + " seconds");
    if ((duration - time).toFixed(0) < 150) {
      return true;
    }
    return false;
  };

  const handleProgress = ({currentTime: time}) => {
    if (type == 'tv') setIsReadyNext(checkTime(time));
    setCurrentPosition(time);
    if (status != 'playing') {
      setStatus('playing');
    }
  };

  const onSeek = value => {
    if (videoRef.current) {
      videoRef.current.seek(value);
    }
    setCurrentTime(value);
    setCurrentPosition(value);
    onPlay();
  };

  const onFullscreen = () => {
    const newFullscreenState = !fullscreen;
    
    if (newFullscreenState) {
      Orientation.lockToLandscape();
      Immersive.setImmersive(true);
      StatusBar.setHidden(true, 'fade');
    } else {
      Orientation.lockToPortrait();
      Immersive.setImmersive(false);
      StatusBar.setHidden(false, 'fade');
    }
    
    setFullscreen(newFullscreenState);
    
    // Notify parent component of fullscreen change
    if (onFullscreenChange) {
      onFullscreenChange(newFullscreenState);
    }
  };

  const onResize = () => {
    resize >= 0 && resize <= 3 ? setResize(resize + 1) : setResize(0);
  };

  useEffect(() => {
    const handleBackPress = () => {
      if (fullscreen) {
        onFullscreen();
        return true;
      } else {
        // Pause video before navigating away
        setPlaying(false);
        if (setIsVideoPlaying) {
          setIsVideoPlaying(false);
        }
        navigation.navigate('Tabs');
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => {
      backHandler.remove();
    };
  }, [fullscreen, navigation, setIsVideoPlaying]);

  if (player_type == 'youtube') {
    return (
      <VideoPlayer
        source={{
          uri: video,
          // add headers do bypassing restrictions if needed
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            Referer: 'https://www.vidfast.pro/',
            Origin: 'https://www.vidfast.pro',
          },
        }}
        showOnStart={true}
        renderFullScreen={() => (
          <Icon
            name="fullscreen"
            size={sizes.width * 0.05}
            color={colors.white}
          />
        )}
        headerTitle={title}
        onTapBack={() => {
          navigation.navigate('Tabs');
        }}
        onPausedChange={state => {
          setPaused(state);
        }}
        onTapMore={() => {
          alert('Cumming soon!');
        }}
        videoHeight={videoHeight}
        paused={paused}
        autoPlay={true}
        doubleTapInterval={300}
        isFullScreen={isFullScreen}
        onEnterFullscreen={() => {
          Immersive.setImmersive(true);
          videoHeight.value = sizes.width;
        }}
        onExitFullscreen={() => {
          Immersive.setImmersive(false);
          videoHeight.value = sizes.width * (9 / 16);
        }}
        // sample subtitle value
        // https://sub.wyzie.ru/c/19b80c53/id/1961813931?format=srt&encoding=UTF-8
        textTracks={[
          {
            title: title,
            language: 'en',
            type: TextTrackType.SRT,
            uri: subtitle,
          },
        ]}
        selectedTextTrack={{type: 'language', value: 'en'}}
      />
    );
  } else {
    // Don't render Video component if we don't have a valid video URL
    if (!video || typeof video !== 'string') {
      console.warn('MediaPlayer: Invalid or missing video URL:', video);
      return (
        <View
          style={{
            zIndex: fullscreen ? 10 : 1,
            height: fullscreen ? sizes.width : sizes.height * 0.3,
            width: fullscreen ? sizes.height : sizes.width,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
          }}>
          <Text style={{ color: 'white', fontSize: 16 }}>
            {status === 'loading' ? 'Loading video...' : 'No video available'}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={{
          zIndex: fullscreen ? 10 : 1,
          height: fullscreen ? sizes.width : sizes.height * 0.3,
          width: fullscreen ? sizes.height : sizes.width,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'black',
        }}>
        <Video
          ref={videoRef}
          source={video ? {
            uri: video,
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              Referer: 'https://www.vidfast.pro/',
              Origin: 'https://www.vidfast.pro',
            },
          } : null}
          rate={1.0}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            height: fullscreen ? sizes.width : sizes.height * 0.3,
            width: fullscreen ? sizes.height : sizes.width,
            backgroundColor: 'black',
          }}
          // selectedAudioTrack={0}
          onLoad={handleLoad}
          resizeMode={['none', 'contain', 'cover', 'stretch'][resize]}
          onBuffer={({isBuffering}) => {
            console.log('Video buffering:', isBuffering);
            if (isBuffering) {
              setStatus('loading');
            }
          }}
          poster={imageUrl}
          posterResizeMode="cover"
          controls={false}
          repeat={true}
          onError={(error) => {
            console.error('Video playback error:', error);
            setStatus('error');
          }}
          muted={false}
          paused={!playing}
          hideShutterView={false}
          onSeek={({currentTime: time}) => {
            setCurrentTime(time);
          }}
          onProgress={handleProgress}
          fullscreen={fullscreen}
          textTracks={[
            {
              title: title,
              language: 'en',
              type: TextTrackType.SRT,
              uri: subtitle || '',
            },
          ]}
          selectedTextTrack={{type: 'language', value: 'en'}}
        />
        <Controls
          title={title}
          hide={controlsHide}
          onHide={() => setControlsHide(!controlsHide)}
          setHide={setControlsHide}
          onPause={onPause}
          onPlay={onPlay}
          movie={movie}
          resize={resize}
          readyNext={isReadyNext}
          onNext={onNext}
          playing={playing}
          currentPosition={currentPosition}
          duration={duration}
          onSeek={onSeek}
          link={video ? true : false}
          fullscreen={fullscreen}
          onFullscreen={onFullscreen}
          onResize={onResize}
          videoStatus={status}
          onDownload={onDownload}
          upperRightComponent={
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* <TouchableOpacity
                                onPress={() => {
                                    startCast(video, imageUrl, title, subtitle, duration, currentTime, undefined, 'No details')
                                }}
                            >
                                <Icon
                                    name="cast"
                                    size={sizes.width * 0.05}
                                    color={colors.white}
                                />
                            </TouchableOpacity> */}
              <CastButton style={{width: 30, height: 30}} />
            </View>
          }
        />
      </View>
    );
  }
};

export default MediaPlayer;
