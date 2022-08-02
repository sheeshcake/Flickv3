import { View, Text, Image, StatusBar, BackHandler } from 'react-native'
import React from 'react'
import Video from 'react-native-video'
import { TextTrackType } from 'react-native-video'
import { colors, sizes } from '~/constants/theme'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';
import Controls from './Controls';
import { useNavigation } from '@react-navigation/native';

const MediaPlayer = ({
    video,
    status,
    title,
    movie,
    imageUrl,
    setStatus,
    onDownload,
    subtitle
}) => {
    const navigation = useNavigation();
    const [controlsHide, setControlsHide] = React.useState(false);
    const [playing, setPlaying] = React.useState(true);
    const [currentPosition, setCurrentPosition] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [fullscreen, setFullscreen] = React.useState(false);
    const [resize, setResize] = React.useState('contain');


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
        if(status != 'playing') {
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
        if(fullscreen) {
            Orientation.lockToPortrait();
            StatusBar.setHidden(false, "fade");
        }else{
            Orientation.lockToLandscape();
            StatusBar.setHidden(true, "fade");
        }
        setFullscreen(!fullscreen);
    }

    const onResize = () => {
        if(resize === 'contain') {
            setResize('cover');
        }
        else {
            setResize('contain');
        }
    }

        
    BackHandler.addEventListener('hardwareBackPress', () => {
        if (fullscreen) {
            setFullscreen(false);
            Orientation.lockToPortrait();
            StatusBar.setHidden(false, "fade");
            return true;
        }
        navigation.goBack();
    });

    return (
        <View
            style={{
                zIndex: fullscreen ? 10 : 1,
                height: fullscreen ? sizes.width : sizes.height * 0.3,
                width: fullscreen ? sizes.height : sizes.width,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: sizes.width * 0.05,
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
                }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    height: fullscreen ? sizes.width : sizes.height * 0.3,
                    width: fullscreen ? sizes.height : sizes.width,
                }}
                onLoad={handleLoad}
                seek={currentTime}
                resizeMode={resize}
                onBuffer={() => {
                    setStatus('loading')
                }}
                controls={false}
                repeat={true}
                muted={false}
                paused={!playing}
                onSeek={({ currentTime: time }) => {
                    setCurrentTime(time)
                }}
                selectedTextTrack={{type: 'language', value: 'en'}}
                onProgress={handleProgress}
                textTracks={[{
                    title: title,
                    language: 'en',
                    type: subtitle.split(".").pop() == "srt" ?TextTrackType.SRT : TextTrackType.VTT,
                    uri: subtitle
                }]}
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

export default MediaPlayer