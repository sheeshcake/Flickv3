import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { sizes, colors } from '~/constants/theme'



const MovieList = ({ title, movies, navigation }) => {
    return (
        <View
            style={{
                paddingHorizontal: sizes.width * 0.03,
                paddingTop: sizes.width * 0.05,
            }}
        >
            <Text
                style={{
                    fontSize: 16,
                    marginBottom: 10,
                    color: colors.white,
                    fontWeight: 'bold',
                }}
            >
                {title}
            </Text>

            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {movies.map(movie => (
                    <View
                        style={{
                            flex: 1,
                            width: sizes.width * 0.25,
                            justifyContent: 'center',
                            marginRight: 10,
                            marginBottom: 10,
                        }}
                        key={movie.id + title}
                    >
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                            }}
                            key={movie.id + title + "touch"}
                            activeOpacity={0.6}
                            onPress={() => {
                                navigation.push('Details', {
                                    movie: movie,
                                })
                            }}
                        >
                            {
                                movie?.quality && (
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: 5,
                                            right: 5,
                                            zIndex: 100,
                                            maxHeight: 20,
                                            padding: 5,
                                            borderRadius: 5,
                                            backgroundColor: movie?.quality === 'HD' ? colors.green : colors.red,
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 10,
                                            color: colors.white
                                        }}
                                        >
                                            {movie?.quality}
                                        </Text>
                                    </View>
                                )
                            }
                            <Image
                                source={{
                                    uri: movie.image,
                                }}
                                style={{
                                    width: sizes.width * 0.25,
                                    height: sizes.height * 0.20,
                                    borderRadius: 10,
                                }}
                            />
                        </TouchableOpacity>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: colors.white,
                                    textAlign: 'center',
                                    marginTop: 5,
                                }}
                            >
                                {movie.title}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default MovieList