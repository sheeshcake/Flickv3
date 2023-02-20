import { View, Text, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, sizes } from '~/constants/theme'
import { useNavigation } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';

const Controls = ({
    hide,
    title,
    link,
    movie,
    playing,
    currentPosition,
    duration,
    fullscreen,
    onFullscreen,
    isBuffering,
    onResize,
    resize,
    onSeek,
    videoStatus,
    onHide,
    onPause,
    onPlay,
    onDownload,
    upperRightComponent
}) => {
    // const {
    //     useStartDownload
    // } = helpers
    const loadingMessage = require('~/constants/loadingmessage.js');
    const navigation = useNavigation();
    const [time, setTime] = useState();
    const [status, setStatus] = useState(status);
    const [loading, setLoading] = useState('Loading...');
    const getRandomNumber = () => {
        const randomNumber = Math.floor(Math.random() * loadingMessage.default.length) + 1;
        return randomNumber
    }
    const changeMessage = () => {
        setTimeout(() => {
            if (videoStatus == 'loading') {
                setLoading(loadingMessage.default[getRandomNumber()]);
                changeMessage();
            }
        }, 3000)
    }

    useEffect(() => {
        const result = new Date(currentPosition * 1000).toISOString().substr(11, 8);
        setTime(result);
    }, [currentPosition]);

    useEffect(() => {
        changeMessage();
    }, []);

    useEffect(() => {
        setStatus(videoStatus);
    }, [videoStatus]);

    return (
        <View
            style={{
                position: fullscreen ? 'absolute' : null,
                justifyContent: 'space-between',
                zIndex: fullscreen ? 10 : 1,
                width: fullscreen ? sizes.height : sizes.width,
                height: fullscreen ? sizes.width : sizes.height * 0.3,
            }}
        >
            <View
                style={{
                    opacity: hide ? 0 : 1,
                    maxHeight: sizes.width * 0.1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: fullscreen ? sizes.height : sizes.width,
                    backgroundColor: colors.transparentBlack,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        Orientation.lockToPortrait();
                        if (!fullscreen) {
                            navigation.goBack();
                        } else {
                            onFullscreen();
                        }
                    }}
                    style={{
                        padding: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon
                        name="arrow-left"
                        size={sizes.width * 0.05}
                        color={colors.white}
                    />
                </TouchableOpacity>
                <Text
                    style={{
                        color: colors.white,
                        fontSize: 20,
                        fontWeight: 'bold',
                    }}
                >
                    {title || "Movie"}
                </Text>
                {upperRightComponent}
            </View>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    onHide()
                }}
                style={{
                    height: sizes.height * 0.2,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {
                        status == "loading" ? (
                            <>
                                <ActivityIndicator size="large" color={colors.red} />
                                <View
                                    style={{
                                        width: '50%',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: colors.white,
                                            fontSize: 14,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {loading}
                                    </Text>
                                </View>
                            </>
                        ) : status == "error" ? (
                            <Text style={{ color: colors.white, fontSize: 20, fontWeight: 'bold' }}>No Video Available :(</Text>
                        ) : (
                            // ADD more Controls HERE
                            <></>
                        )
                    }
                </View>
            </TouchableOpacity>
            <View
                style={{
                    opacity: hide || status == "error" ? 0 : 1,
                    flexDirection: 'row',
                    width: fullscreen ? sizes.height : sizes.width,
                    maxHeight: sizes.width * 0.1,
                    justifyContent: 'space-between',
                    backgroundColor: colors.transparentBlack,
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        playing ? onPause() : onPlay();
                    }}
                    style={{
                        padding: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon
                        name={playing ? "pause" : "play"}
                        size={sizes.width * 0.05}
                        color={colors.white}
                    />
                </TouchableOpacity>
                <Slider
                    style={{
                        flex: 1,
                        width: fullscreen ? sizes.height * 0.7 : sizes.width * 0.7,
                        zIndex: 100,
                    }}
                    step={1}
                    value={currentPosition}
                    minimumValue={0}
                    maximumValue={duration}
                    thumbTintColor={colors.red}
                    maximumTrackTintColor={colors.light}
                    minimumTrackTintColor={colors.red}
                    onSlidingStart={() => onPause()}
                    onSlidingComplete={value => onSeek(value)}
                />
                <Text>{time}</Text>
                {
                    fullscreen && (
                        <TouchableOpacity
                            onPress={onResize}
                            style={{
                                padding: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Icon
                                name="magnify"
                                size={sizes.width * 0.05}
                                color={colors.white}
                            />
                        </TouchableOpacity>
                    )
                }
                <TouchableOpacity
                    onPress={onFullscreen}
                    style={{
                        padding: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon
                        name={fullscreen ? "fullscreen-exit" : "fullscreen"}
                        size={sizes.width * 0.05}
                        color={colors.white}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Controls