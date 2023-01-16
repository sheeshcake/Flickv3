import React from 'react'
import { View, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import tmdb from '~/api/tmdb'
import solarmovie from '../../api/solarmovie';
import { colors } from '~/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const TvEpisodes = ({ episodeData, setSelectedEpisode, selectedEpisode, isLoaded }) => {

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
                                borderWidth: 1,
                                borderRadius: 10,
                                borderColor: selectedEpisode?.id === episode.id ? colors.white : colors.black,
                            }}
                        >
                            <Image
                                source={episode?.image ? { uri: episode.image } : require('~/assets/logo/logo.png')}
                                style={{
                                    borderRadius: 10,
                                    marginHorizontal: 10,
                                    width: 100,
                                    height: 50,
                                }}
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
                                        height: 50,
                                    }}
                                >
                                    {
                                        !isLoaded ?
                                            <ActivityIndicator size="small" color={colors.red} />
                                            :
                                            <Icon
                                                name="play"
                                                size={30}
                                                color={colors.white}
                                            />
                                    }
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