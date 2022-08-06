import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { sizes, colors } from '~/constants/theme';
import Header from '~/components/Header';
import { useSelector } from 'react-redux';
import MovieCarousel from '~/components/MovieCarousel';
import MovieList from '~/components/MovieList';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import CreditsModal from '~/components/CreditsModal';


const Home = ({ isFocused, navigation }) => {
    const {
        movies,
        popular_movie,
        horror_movie,
        action_movie,
        comedy_movie,
        romance_movie,
        tv_show,
    } = useSelector(state => state.home)
    const {
        provider
    } = useSelector(state => state.profile)
    const [openCredits, setOpenCredits] = useState(false)

    const clearData = async () => {
        try {
            await AsyncStorage.removeItem('userData')
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <SafeAreaView
            style={{
                flex: 1,
                forceInset: { bottom: 'never' },
                backgroundColor: colors.black,
            }}
        >
            <Header
                onPressCredits={() => setOpenCredits(!openCredits)}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    marginTop: sizes.width * 0.15,
                }}
            >
                <MovieCarousel movies={movies} navigation={navigation} />
                <MovieList key={1} title="Top Rated" movies={popular_movie} navigation={navigation} />
                <MovieList key={2} title="Horror" movies={horror_movie} navigation={navigation} />
                <MovieList key={3}  title="Action" movies={action_movie} navigation={navigation} />
                <MovieList key={4}  title="Comedy" movies={comedy_movie} navigation={navigation} />
                <MovieList key={5}  title="Romance" movies={romance_movie} navigation={navigation} />
                <MovieList key={6}  title="TV Show" movies={tv_show} navigation={navigation} />
            </ScrollView>
            <CreditsModal
                isOpen={openCredits}
                onClose={() => {
                    setOpenCredits(!openCredits)
                }}
            />
        </SafeAreaView>
    )
}

export default Home