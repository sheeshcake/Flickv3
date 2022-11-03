import React from 'react'
import { View, TouchableOpacity, Image, Text } from 'react-native';
import tmdb from '~/api/tmdb'
import solarmovie from '../../api/solarmovie';
import { colors } from '~/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const TvEpisodes = ({ episodeData, setSelectedEpisode, selectedEpisode}) => {

    return (
        <View
            style={{
                flex: 1,
                zIndex: 10,
                flexDirection: 'column',
                height: '100%',
            }}
        >
            {
                episodeData?.map(episode => (
                    console.log(episode),
                    <TouchableOpacity
                        key={episode.id}
                        onPress={() => {
                            setSelectedEpisode(episode)
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                padding: 10,
                                paddingTop: 15,
                                borderBottomWidth: 1,
                            }}
                        >
                            <Image
                                source={episode?.image ? { uri: episode.image } : require('~/assets/logo/logo.png')}
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 10,
                                    marginHorizontal: 10,
                                }}
                                resizeMode="cover"
                            />
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    marginHorizontal: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: colors.white,
                                        paddingBottom: 5,
                                    }}
                                >{episode.title}</Text>
                                <Text
                                    style={{
                                        color: colors.white,
                                    }}
                                    numberOfLines={4}
                                >
                                    {episode.overview}
                                </Text>
                            </View>
                            {
                                selectedEpisode?.id === episode.id &&
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: 100,
                                    }}
                                >
                                    <Icon
                                        name="play"
                                        size={30}
                                        color={colors.white}
                                    />
                                </View>
                            }
                        </View>
                    </TouchableOpacity>
                ))
            }
        </View>
    )
}

export default TvEpisodes