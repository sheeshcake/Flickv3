import { View, Text, ActivityIndicator, TouchableWithoutFeedback, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, sizes } from '~/constants/theme'
import { useNavigation } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';

const Controls = ({
    hide,
    setHide,
    title,
    link,
    movie,
    readyNext,
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
    onNext,
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
    const [isReadyNext, setIsReadyNext] = useState(false);
    const [loading, setLoading] = useState('Loading...');
    const [showSeekIndicator, setShowSeekIndicator] = useState(null);
    const lastTapLeft = useRef(null);
    const lastTapRight = useRef(null);
    const hideControlsTimeout = useRef(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;
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

    // Auto-hide controls
    const resetAutoHide = () => {
        if (hideControlsTimeout.current) {
            clearTimeout(hideControlsTimeout.current);
        }
        
        if (!hide) {
            hideControlsTimeout.current = setTimeout(() => {
                onHide();
            }, 3000);
        }
    };

    useEffect(() => {
        if (!hide && playing) {
            resetAutoHide();
        }
        return () => {
            if (hideControlsTimeout.current) {
                clearTimeout(hideControlsTimeout.current);
            }
        };
    }, [hide, playing]);

    // Handle double tap on left side
    const handleLeftTap = () => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (lastTapLeft.current && now - lastTapLeft.current < DOUBLE_TAP_DELAY) {
            // Double tap detected
            const newPosition = Math.max(0, currentPosition - 5);
            onSeek(newPosition);
            setShowSeekIndicator('left');
            setTimeout(() => setShowSeekIndicator(null), 500);
            lastTapLeft.current = null;
            setHide(false);
        } else {
            lastTapLeft.current = now;
            setTimeout(() => {
                lastTapLeft.current = null;
            }, DOUBLE_TAP_DELAY);
            onHide();
        }
        resetAutoHide();
    };

    // Handle double tap on right side
    const handleRightTap = () => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (lastTapRight.current && now - lastTapRight.current < DOUBLE_TAP_DELAY) {
            // Double tap detected
            const newPosition = Math.min(duration, currentPosition + 5);
            onSeek(newPosition);
            setShowSeekIndicator('right');
            setTimeout(() => setShowSeekIndicator(null), 500);
            lastTapRight.current = null;
            setHide(false);
        } else {
            lastTapRight.current = now;
            setTimeout(() => {
                lastTapRight.current = null;
            }, DOUBLE_TAP_DELAY);
            onHide();
        }
        resetAutoHide();
    };

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

    useEffect(() => {
        setIsReadyNext(readyNext);
    }, [readyNext]);

    const trim = (text) => {
        return text?.length > 12 ? text.substring(0, 12) + "..." : text;
    }

    return (
        <View
            style={{
                position: fullscreen ? 'absolute' : null,
                justifyContent: 'space-between',
                zIndex: fullscreen ? 10 : 1,
                width: fullscreen ? sizes.height : sizes.width,
                height: fullscreen ? sizes.width : sizes.height * 0.3,
            }}
            pointerEvents="box-none"
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
                pointerEvents={hide ? "none" : "auto"}
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
                    {trim(title) || "Movie"}
                </Text>
                {upperRightComponent}
            </View>
            <View
                style={{
                    height: sizes.height * 0.2,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                pointerEvents="box-none"
            >
                {/* Left side double tap area */}
                <TouchableWithoutFeedback onPress={handleLeftTap}>
                    <View style={{ 
                        flex: 1, 
                        height: '100%', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                    }}>
                        {showSeekIndicator === 'left' && (
                            <View style={{ alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8 }}>
                                <Icon
                                    name="rewind-5"
                                    size={sizes.width * 0.12}
                                    color={colors.white}
                                />
                                <Text style={{ color: colors.white, fontSize: 14, marginTop: 5, fontWeight: 'bold' }}>-5s</Text>
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>

                {/* Center content */}
                <TouchableWithoutFeedback
                    onPress={() => {
                        onHide();
                        resetAutoHide();
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                            height: '100%',
                            backgroundColor: 'transparent',
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
                </TouchableWithoutFeedback>

                {/* Right side double tap area */}
                <TouchableWithoutFeedback onPress={handleRightTap}>
                    <View style={{ 
                        flex: 1, 
                        height: '100%', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                    }}>
                        {showSeekIndicator === 'right' && (
                            <View style={{ alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8 }}>
                                <Icon
                                    name="fast-forward-5"
                                    size={sizes.width * 0.12}
                                    color={colors.white}
                                />
                                <Text style={{ color: colors.white, fontSize: 14, marginTop: 5, fontWeight: 'bold' }}>+5s</Text>
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </View>
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
                pointerEvents={hide || status === "error" ? "none" : "auto"}
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
                    onSlidingStart={() => {
                        onPause();
                        if (hideControlsTimeout.current) {
                            clearTimeout(hideControlsTimeout.current);
                        }
                    }}
                    onSlidingComplete={value => {
                        onSeek(value);
                        resetAutoHide();
                    }}
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
            <View
                style={{
                    position: 'absolute',
                    right: sizes.width * 0.05,
                    bottom: sizes.width * 0.15,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    zIndex: 100,
                }}
            >
                {(isReadyNext && fullscreen) &&
                    <TouchableOpacity
                        style={{
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            backgroundColor: colors.white,
                            flexDirection: 'row',
                            borderRadius: 5,
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            // Call onNext without affecting fullscreen state
                            onNext && onNext();
                        }}
                    >
                        <Icon
                            name="fast-forward"
                            size={sizes.width * 0.05}
                            color={colors.black}
                        />
                        <Text
                            style={{
                                color: colors.black,
                                fontSize: sizes.width * 0.04,
                                fontWeight: 'bold',
                                paddingHorizontal: 5,
                            }}
                        >
                            Next Eposide
                        </Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default Controls