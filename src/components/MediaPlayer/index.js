import { View, Text, Image, StatusBar, BackHandler } from 'react-native'
import React from 'react'
import Video from 'react-native-video'
import { TextTrackType } from 'react-native-video'
import { colors, sizes } from '~/constants/theme'
import { Immersive } from 'react-native-immersive'
import Orientation from 'react-native-orientation-locker';
import Controls from './Controls';
import VideoPlayer from 'react-native-reanimated-player';
import { useSharedValue } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MediaPlayer = ({
    video,
    status,
    title,
    movie,
    imageUrl,
    setStatus,
    onDownload,
    subtitle,
    navigation,
    player_type
}) => {
    const [controlsHide, setControlsHide] = React.useState(false);
    const [playing, setPlaying] = React.useState(true);
    const [paused, setPaused] = React.useState(false);
    const [currentPosition, setCurrentPosition] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [fullscreen, setFullscreen] = React.useState(false);
    const [resize, setResize] = React.useState(1);
    const videoHeight = useSharedValue(sizes.width * (9 / 16));
    const isFullScreen = useSharedValue(false);

    const onPause = () => {
        setPlaying(false);
    }

    const handleLoad = ({ duration: mediaDuration }) => {
        setDuration(mediaDuration);
    }

    const onPlay = () => {
        setPlaying(true);
    }

    const handleProgress = ({ currentTime: time }) => {
        setCurrentPosition(time);
        if (status != 'playing') {
            setStatus('playing')
        }
    }

    const onSeek = (value) => {
        console.log('change', value, currentPosition)
        setCurrentTime(value);
        setCurrentPosition(value);
        onPlay();
    }

    const onFullscreen = () => {
        if (fullscreen) {
            Orientation.lockToPortrait();
            Immersive.setImmersive(!fullscreen)
            StatusBar.setHidden(false, "fade");
        } else {
            Orientation.lockToLandscape();
            Immersive.setImmersive(!fullscreen)
            StatusBar.setHidden(true, "fade");
        }
        setFullscreen(!fullscreen);
    }

    const onResize = () => {
        resize >= 0 && resize <= 3 ? setResize(resize + 1) : setResize(0);
    }

    BackHandler.addEventListener('hardwareBackPress', () => {
        if (fullscreen) {
            onFullscreen();
            return true;
        } else {
            navigation.navigate("Tabs");
            return true;
        }
    })

    if (player_type == 'youtube') {
        return (
            <VideoPlayer
                source={{
                    uri: video,
                    headers: {
                        "Origin": "https://theflix.to",
                        "Referer": "https://theflix.to/",
                    }
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
                    navigation.navigate("Tabs");
                }}
                onPausedChange={state => {
                    setPaused(state);
                }}
                videoHeight={videoHeight}
                paused={paused}
                autoPlay={true}
                doubleTapInterval={300}
                isFullScreen={isFullScreen}
                onEnterFullscreen={() => {
                    Immersive.setImmersive(true)
                    videoHeight.value = sizes.width;
                }}
                onExitFullscreen={() => {
                    Immersive.setImmersive(false)
                    videoHeight.value = sizes.width * (9 / 16);
                }}
                selectedTextTrack={subtitle != "" && subtitle ? { type: 'language', value: 'en' } : { type: 'language', value: 'none' }}
                textTracks={subtitle != "" && subtitle ? [{
                    title: title,
                    language: 'en',
                    type: subtitle.split(".").pop() == "srt" ? TextTrackType.SRT : TextTrackType.VTT,
                    uri: subtitle.link
                }] : []}
            />
        )
    } else {
        return (
            <View
                style={{
                    zIndex: fullscreen ? 10 : 1,
                    height: fullscreen ? sizes.width : sizes.height * 0.3,
                    width: fullscreen ? sizes.height : sizes.width,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgrounImage: imageUrl,
                }}
                activeOpacity={1}
                onPress={() => {
                    setControlsHide(!controlsHide);
                }}
            >
                <Video
                    source={{
                        uri: video,
                        headers: {
                            'User-Agent' :'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0',
                            'Origin': 'https://theflix.to',
                            'Referer': 'https://theflix.to/',
                        }
                    }}
                    rate={1.0}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        height: fullscreen ? sizes.width : sizes.height * 0.3,
                        width: fullscreen ? sizes.height : sizes.width,
                    }}
                    // selectedAudioTrack={0}
                    onLoad={handleLoad}
                    seek={currentTime}
                    resizeMode={['none', 'contain', 'cover', 'stretch'][resize]}
                    onBuffer={() => {
                        setStatus('loading')
                    }}
                    poster={imageUrl}
                    posterResizeMode="cover"
                    controls={false}
                    repeat={true}
                    onError={(error) => {
                        console.log(error)
                    }}
                    muted={false}
                    paused={!playing}
                    hideShutterView={true}
                    onSeek={({ currentTime: time }) => {
                        setCurrentTime(time)
                    }}
                    onProgress={handleProgress}
                    fullscreen={fullscreen}
                    selectedTextTrack={subtitle != "" && subtitle ? { type: 'language', value: 'en' } : { type: 'language', value: 'none' }}
                    textTracks={subtitle != "" && subtitle ? [{
                        title: title,
                        language: 'en',
                        type: subtitle.split(".").pop() == "srt" ? TextTrackType.SRT : TextTrackType.VTT,
                        uri: subtitle
                    }] : []}
                />
                <Controls
                    title={title}
                    hide={controlsHide}
                    onHide={() => setControlsHide(!controlsHide)}
                    onPause={onPause}
                    onPlay={onPlay}
                    movie={movie}
                    resize={resize}
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
                />
            </View>
        )
    }
}

export default MediaPlayer