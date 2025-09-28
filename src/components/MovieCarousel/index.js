import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    View,
    Image,
    Animated,
    Platform,
    Text,
    ActivityIndicator,
    ImageBackground,
    Dimensions,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { colors, sizes } from '~/constants/theme';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.5; // Extended height for better blending
const SPACING = 20;

const NetflixHeroCarousel = ({ movies = [], navigation }) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [moviesData, setMovies] = useState([]);
    const [imageErrors, setImageErrors] = useState({});
    const flatListRef = useRef(null);
    
    useEffect(() => {
        if (movies && movies.length > 0) {
            setMovies(movies);
            // Auto-scroll every 5 seconds
            const timer = setInterval(() => {
                if (flatListRef.current && movies.length > 1) {
                    setCurrentIndex(prev => {
                        const nextIndex = (prev + 1) % movies.length;
                        flatListRef.current.scrollToIndex({ 
                            index: nextIndex, 
                            animated: true 
                        });
                        return nextIndex;
                    });
                }
            }, 10000);
            
            return () => clearInterval(timer);
        }
    }, [movies]);

    const handleScroll = useCallback((event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setCurrentIndex(index);
    }, []);
    
    const handleImageError = useCallback((itemId) => {
        setImageErrors(prev => ({ ...prev, [itemId]: true }));
    }, []);

    const renderHeroItem = ({ item, index }) => {
        if (!item || !item.id) return null;

        const opacity = scrollX.interpolate({
            inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
        });

        const scale = scrollX.interpolate({
            inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
            ],
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
        });

        const hasImageError = imageErrors[item.id];
        const backgroundImage = item.backdrop_path || item.image;

        return (
            <Animated.View
                style={{
                    width,
                    height: HERO_HEIGHT,
                    opacity,
                    transform: [{ scale }],
                }}
            >
                {hasImageError || !backgroundImage ? (
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: colors.black,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon name="image-off" size={60} color={colors.white} />
                        <Text style={{
                            color: colors.white,
                            fontSize: 16,
                            marginTop: 10,
                            textAlign: 'center'
                        }}>
                            {item.title || 'No Image Available'}
                        </Text>
                    </View>
                ) : (
                    <ImageBackground
                        source={{ uri: backgroundImage }}
                        style={{ flex: 1 }}
                        resizeMode="cover"
                        onError={() => handleImageError(item.id)}
                    >
                        {/* Top gradient overlay - blend with header */}
                        <LinearGradient
                            colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.1)', 'transparent']}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: height * 0.3,
                                zIndex: 1,
                            }}
                        />
                        
                        {/* Bottom gradient overlay - blend with Top Rated section */}
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)', '#000000']}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: height * 0.5,
                                zIndex: 1,
                            }}
                        />

                        {/* Quality badge */}
                        {item.quality && (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 60,
                                    right: 20,
                                    zIndex: 2,
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    borderRadius: 4,
                                    backgroundColor: item.quality === 'HD' ? '#00C851' : 
                                                   item.quality === '4K' ? '#007bff' :
                                                   item.quality === 'CAM' ? '#ff4444' : '#ff8800',
                                }}
                            >
                                <Text style={{
                                    fontSize: 12,
                                    color: colors.white,
                                    fontWeight: 'bold'
                                }}>
                                    {item.quality}
                                </Text>
                            </View>
                        )}

                        {/* Content overlay */}
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                paddingHorizontal: SPACING,
                                paddingBottom: 60,
                                zIndex: 2,
                            }}
                        >

                            {/* Movie title */}
                            <Text
                                style={{
                                    color: colors.white,
                                    fontSize: 28,
                                    fontWeight: 'bold',
                                    marginBottom: 8,
                                    textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                    textShadowOffset: { width: 0, height: 1 },
                                    textShadowRadius: 3,
                                }}
                                numberOfLines={2}
                            >
                                {item.title || item.name || 'Unknown Title'}
                            </Text>

                            {/* Movie overview */}
                            {item.overview && (
                                <Text
                                    style={{
                                        color: colors.white,
                                        fontSize: 14,
                                        lineHeight: 20,
                                        marginBottom: 16,
                                        opacity: 0.9,
                                        textShadowColor: 'rgba(0, 0, 0, 0.5)',
                                        textShadowOffset: { width: 0, height: 1 },
                                        textShadowRadius: 2,
                                    }}
                                    numberOfLines={3}
                                >
                                    {item.overview}
                                </Text>
                            )}

                            {/* Action buttons */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {/* Play button */}
                                <TouchableOpacity
                                    onPress={() => {
                                        if (item && item.id && navigation) {
                                            navigation.push('Details', {
                                                movie: item,
                                            });
                                        }
                                    }}
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        backgroundColor: colors.white,
                                        paddingVertical: 12,
                                        paddingHorizontal: 20,
                                        borderRadius: 6,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 10,
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Icon
                                        name="play"
                                        size={20}
                                        color={colors.black}
                                    />
                                    <Text
                                        style={{
                                            color: colors.black,
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            marginLeft: 8,
                                        }}
                                    >
                                        Play
                                    </Text>
                                </TouchableOpacity>

                                {/* My List button
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log('Add to list:', item.title);
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        backgroundColor: 'rgba(109, 109, 110, 0.7)',
                                        paddingVertical: 12,
                                        paddingHorizontal: 20,
                                        borderRadius: 6,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Icon
                                        name="plus"
                                        size={20}
                                        color={colors.white}
                                    />
                                    <Text
                                        style={{
                                            color: colors.white,
                                            fontSize: 16,
                                            fontWeight: '600',
                                            marginLeft: 8,
                                        }}
                                    >
                                        My List
                                    </Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    </ImageBackground>
                )}
            </Animated.View>
        );
    };

    if (!moviesData || moviesData.length === 0) {
        return (
            <View style={{
                height: HERO_HEIGHT,
                backgroundColor: colors.black,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size="large" color={colors.white} />
                <Text style={{
                    color: colors.white,
                    fontSize: 16,
                    marginTop: 10
                }}>
                    Loading...
                </Text>
            </View>
        );
    }
    
    return (
        <View style={{ backgroundColor: '#000000' }}>
            <Animated.FlatList
                ref={flatListRef}
                data={moviesData}
                renderItem={renderHeroItem}
                keyExtractor={(item, index) => `hero-${item.id || index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { 
                        useNativeDriver: false,
                        listener: handleScroll
                    }
                )}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={width}
                snapToAlignment="start"
                removeClippedSubviews={false}
                getItemLayout={(data, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
            />
            
            {/* Page indicators */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 20,
                    left: 0,
                    right: 0,
                    zIndex: 3,
                }}
            >
                {moviesData.map((_, index) => (
                    <Animated.View
                        key={index}
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: currentIndex === index ? colors.white : 'rgba(255, 255, 255, 0.3)',
                            marginHorizontal: 4,
                        }}
                    />
                ))}
            </View>
        </View>
    );
};

export default NetflixHeroCarousel;