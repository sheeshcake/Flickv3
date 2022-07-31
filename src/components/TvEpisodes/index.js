import React from 'react'
import { View, TouchableOpacity, Image, Text } from 'react-native';
import tmdb from '~/api/tmdb'
import { colors } from '~/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const TvEpisodes = ({ tv, seasonData, setVideo }) => {

    const [episodes, setEpisodes] = React.useState([])
    const [selectedEpisode, setSelectedEpisode] = React.useState();

    const getEpisodes = async () => {
        const episodes = await tmdb.get_episodes(tv.id, tv.title, seasonData.season_number);
        setEpisodes(episodes)
        setSelectedEpisode(episodes[0])
        const video = await tmdb.get_episode_link(tv.id, tv.title, seasonData.season_number, episodes[0].episode_number || 1);
        setVideo(video.link)
    }

    React.useEffect(() => {
        getEpisodes()
    }, [seasonData, tv])

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
                episodes?.map(episode => (
                    <TouchableOpacity
                        key={episode.id}
                        onPress={() => {
                            setSelectedEpisode(episode)
                            setVideo(episode.link)
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
                                source={{ uri: episode.image }}
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 10,
                                    marginHorizontal: 10,
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
                                        color: colors.light,
                                        paddingBottom: 5,
                                    }}
                                >{episode.title}</Text>
                                <Text
                                    style={{
                                        color: colors.light,
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
                                        color={colors.light}
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