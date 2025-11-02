import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { sizes, colors } from '~/constants/theme';
import Header from '~/components/Header';
import { useSelector, useDispatch } from 'react-redux';
import MovieCarousel from '~/components/MovieCarousel';
import MovieList from '~/components/MovieList';
import ContinueWatchingList from '~/components/ContinueWatchingList';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import CreditsModal from '~/components/CreditsModal';
import { loadItems, removeItem } from '~/redux/continueWatchingSlice';
import { continueWatchingStorage } from '~/helpers/continueWatchingStorage';


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
    const { items: continueWatchingItems } = useSelector(state => state.continueWatching);
    const dispatch = useDispatch();
    const [openCredits, setOpenCredits] = useState(false)

    // Load continue watching data on mount
    useEffect(() => {
        const loadContinueWatching = async () => {
            const savedItems = await continueWatchingStorage.load();
            dispatch(loadItems(savedItems));
        };
        loadContinueWatching();
    }, [dispatch, navigation]);

    const handleRemoveContinueWatching = async (item) => {
        dispatch(removeItem({
            id: item.id,
            seasonNumber: item.seasonNumber,
            episodeNumber: item.episodeNumber,
            type: item.type,
        }));
        
        // Update AsyncStorage
        await continueWatchingStorage.removeItem(
            item.id,
            item.seasonNumber,
            item.episodeNumber,
            item.type
        );
    };

    const clearData = async () => {
        try {
            await AsyncStorage.removeItem('userData')
        } catch (error) {
            alert("An error occured while clearing data")
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
                <ContinueWatchingList 
                    items={continueWatchingItems} 
                    navigation={navigation}
                    onRemove={handleRemoveContinueWatching}
                />
                <MovieList key={Math.floor(Math.random() * 10000) + 1} title="Top Rated" movies={popular_movie} navigation={navigation} />
                <MovieList key={Math.floor(Math.random() * 10000) + 1} title="Horror" movies={horror_movie} navigation={navigation} />
                <MovieList key={Math.floor(Math.random() * 10000) + 1}  title="Action" movies={action_movie} navigation={navigation} />
                <MovieList key={Math.floor(Math.random() * 10000) + 1}  title="Comedy" movies={comedy_movie} navigation={navigation} />
                <MovieList key={Math.floor(Math.random() * 10000) + 1}  title="Romance" movies={romance_movie} navigation={navigation} />
                <MovieList key={Math.floor(Math.random() * 10000) + 1}  title="TV Show" movies={tv_show} navigation={navigation} />
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