import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, sizes } from '~/constants/theme'
import MediaPlayer from '~/components/MediaPlayer'
import { ScrollView } from 'react-native-gesture-handler'
import TheFlixProvider from "~/providers/KrazyDevsScrapper/TheFlixProvider";
import TvDetails from '~/components/TvDetails'
import TvEpisodes from '~/components/TvEpisodes'


const Details = ({ navigation, route }) => {
    const { movie } = route.params;
    const [video, setVideo] = useState(null);
    const [status, setStatus] = useState('loading');
    const [seasonData, setSeasonData] = useState([]);
    const [tvLink, setTvLink] = useState("");
    

    const getVideo = async () => {
        setStatus('loading');
        try{
            const video = await TheFlixProvider.loadFlicks(movie.link, movie.type);
            setVideo(video.url);
            setStatus('success');
        }catch(error){
            setStatus('error');
        }
    }

    const getTv = async () => {
        setStatus('loading');
        if(!tvLink.includes('undefined') && !tvLink.includes('null')){
            try{
                const tv = await TheFlixProvider.loadFlicks(tvLink, movie.type);
                setVideo(tv.url);
                setStatus('success');
            }catch(error){
                setStatus('error');
            }
        }
    }

    useEffect(() => {
        movie.type == "movie" ? getVideo()  : getTv();
    } , [tvLink])


    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: colors.black,
                padding: 0
            }}
        >
            <MediaPlayer
                title={movie.title}
                video={video}
                status={status}
                setStatus={(d) => setStatus(d)}
                imageUrl={movie.image}
                navigation={navigation}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    marginTop: 20,
                }}
            >
                <View
                    style={{
                        padding: sizes.padding,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Image
                            source={{ uri: movie.image }}
                            style={{
                                width: sizes.width * 0.25,
                                height: sizes.width * 0.45,
                                borderRadius: 10,
                                marginHorizontal: 10,
                            }}
                        />
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "column",
                                alignItems: "flex-start",
                                paddingTop: 15,
                                marginHorizontal: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 30,
                                    fontWeight: "bold",
                                    color: colors.light,
                                    paddingBottom: 5,
                                }}
                            >{movie.title}</Text>
                            <Text
                                style={{
                                    color: colors.light,
                                }}
                            >
                                {movie.description}
                            </Text>
                        </View>
                    </View>
                    {
                        movie.type === "tv" && (
                            <View>
                                <TvDetails
                                    setSeasonData={(data) => setSeasonData(data)}
                                    tv={movie}
                                />
                                <TvEpisodes
                                    tv={movie}
                                    seasonData={seasonData}
                                    setVideo={(video) => setTvLink(video)}
                                />
                            </View>
                        )
                    }
                </View>
            </ScrollView>
        </View>
    )
}


export default Details