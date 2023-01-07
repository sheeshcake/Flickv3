import * as React from 'react';
import {
    View,
    Image,
    Animated,
    Platform,
    Text,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, sizes } from '~/constants/theme';

const SPACING = 10;
const ITEM_SIZE = Platform.OS === 'ios' ? sizes.width * 0.50 : sizes.width * 0.35;
const EMPTY_ITEM_SIZE = (sizes.width - ITEM_SIZE) / 2;



const MovieCarousel = ({ movies, navigation }) => {
    const scrollX = React.useRef(new Animated.Value(0)).current;
    const [moviesData, setMovies] = React.useState([]);
    const [selectedMovie, setSelectedMovie] = React.useState([]);
    const ref = React.useRef(null);
    React.useEffect(() => {
        setMovies([{ key: 'empty-left' }, ...movies, { key: 'empty-right' }]);
    }, [movies]);


    const onViewRef = React.useRef((viewableItems) => {
        const data = movies.find(data => data?.id == viewableItems.viewableItems[1]?.key);
        setSelectedMovie(data)
    });
    return (
        <View>
            <Animated.FlatList
                showsHorizontalScrollIndicator={false}
                data={moviesData || []}
                keyExtractor={(item) => item.id + item.name + "-carouselkey" + Math.floor(Math.random() * 10000) + 1}
                horizontal
                bounces={false}
                ref={ref}
                decelerationRate={Platform.OS === 'ios' ? 0 : 0.90}
                renderToHardwareTextureAndroid
                contentContainerStyle={{ alignItems: 'center' }}
                snapToInterval={ITEM_SIZE}
                onViewableItemsChanged={onViewRef.current}
                snapToAlignment='start'
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => {
                    const inputRange = [
                        (index - 2) * ITEM_SIZE,
                        (index - 1) * ITEM_SIZE,
                        index * ITEM_SIZE,
                    ];
                    if (!item.image) {
                        return <View key={'empty' + item.key + index + Math.floor(Math.random() * 10000) + 1} style={{ width: EMPTY_ITEM_SIZE }} />;
                    }
                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.8, 1, 0.8],
                        extrapolate: 'clamp',
                    });


                    return (
                        <TouchableOpacity
                            style={{
                                width: ITEM_SIZE,
                                height: ITEM_SIZE * 1.5
                            }}
                            key={item.id + index + item.name + "-carousel" + Math.floor(Math.random() * 10000) + 1}
                            onPress={() => {
                                navigation.push('Details', {
                                    movie: item,
                                })
                            }}
                        >
                            <Animated.View
                                style={{
                                    backgroundColor: colors.gray,
                                    marginHorizontal: SPACING,
                                    alignItems: 'center',
                                    transform: [{ scale }],
                                }}
                                key={item.id + index + "-animatedview" + Math.floor(Math.random() * 10000) + 1}
                            >
                                {
                                    item?.quality && (
                                        <View
                                            style={{
                                                position: 'absolute',
                                                top: 5,
                                                right: -5,
                                                zIndex: 100,
                                                maxHeight: 20,
                                                padding: 5,
                                                borderRadius: 5,
                                                backgroundColor: item?.quality === 'HD' ? colors.green : colors.red,
                                            }}
                                            key={item.id + "-viewcarousel" + Math.floor(Math.random() * 10000) + 1}
                                        >
                                            <Text style={{
                                                fontSize: 8,
                                                color: colors.white
                                            }}
                                            >
                                                {item?.quality}
                                            </Text>
                                        </View>
                                    )
                                }
                                <Image
                                    source={{
                                        uri: item.image,
                                    }}
                                    style={{
                                        borderRadius: 10,
                                        height: ITEM_SIZE * 1.5,
                                        width: ITEM_SIZE
                                    }}
                                    key={item.id + "-carousel-image" + Math.floor(Math.random() * 10000) + 1}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    );
                }}
            />
            <View
                style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                }}
            >
                <Text
                    style={{
                        color: colors.white,
                        fontSize: 20,
                    }}
                >
                    {selectedMovie?.title}
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: SPACING,
                        width: sizes.width * 0.7,
                        paddingVertical: 5,
                    }}
                >
                    {/* <TouchableOpacity
                        onPress={() => {
                            console.log('heart')
                        }}
                        style={{
                            padding: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon
                            name="plus-circle-outline"
                            size={sizes.width * 0.05}
                            color={colors.white}
                        />
                        <Text>My List</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={() => {
                            navigation.push('Details', {
                                movie: selectedMovie,
                            })
                        }}
                        style={{
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            backgroundColor: colors.white,
                            flexDirection: 'row',
                            borderRadius: 5,
                            alignItems: 'center',
                        }}
                    >
                        <Icon
                            name="play"
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
                            Play
                        </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        onPress={() => {
                            console.log('profile')
                        }}
                        style={{
                            padding: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon
                            name="information-outline"
                            size={sizes.width * 0.05}
                            color={colors.white}
                        />
                        <Text>Details</Text>
                    </TouchableOpacity> */}
                </View>
            </View>

        </View>
    );
}

export default MovieCarousel