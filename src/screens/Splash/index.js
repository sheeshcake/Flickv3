import { View, Text, Image, ActivityIndicator, PermissionsAndroid, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '~/constants/theme'
import AsyncStorage from '@react-native-community/async-storage'
import { useDispatch } from 'react-redux'
import {
    setMovies,
    setPopularMovie,
    setHorrorMovie,
    setActionMovie,
    setComedyMovie,
    setRomanceMovie,
    setTvShow,
} from '~/redux/homeSlice'

import { useSelector } from 'react-redux'

import {
    getprofileData,
    setProvider,
} from '~/redux/profileSlice'

// import providers here

import {
    getheroflixhq,
    getgenreflixhq,
} from '~/providers/KrazyDevsScrapper/FlixHQProvider'

import {
    getherosolarmovie,
    getgenresolarmovie,
} from '~/providers/KrazyDevsScrapper/SolarMovieProvider'

import {
    getherofmovies,
    getgenrefmovies,
} from '~/providers/KrazyDevsScrapper/FMoviesProvider'

////////////////////
import { fromPairs } from 'lodash'

const Splash = ({ navigation }) => {
    const loadingMessage = require('~/constants/loadingmessage.js');
    const dispatch = useDispatch()
    const {
        provider
    } = useSelector(state => state.profile)

    const laodDataFlixHQ = async () => {
        dispatch(setMovies(await getheroflixhq()));
        dispatch(setPopularMovie(await getheroflixhq('movie')));
        dispatch(setHorrorMovie(await getgenreflixhq('horror', 'movie')));
        dispatch(setActionMovie(await getgenreflixhq('action', 'movie')));
        dispatch(setComedyMovie(await getgenreflixhq('comedy', 'movie')));
        dispatch(setRomanceMovie(await getgenreflixhq('romance', 'movie')));
        dispatch(setTvShow(await getheroflixhq('tv')));
        getData();
    }

    const laodDataSolarMovie = async () => {
        dispatch(setMovies(await getherosolarmovie()));
        dispatch(setPopularMovie(await getherosolarmovie('movie')));
        dispatch(setHorrorMovie(await getgenresolarmovie('horror', 'movie')));
        dispatch(setActionMovie(await getgenresolarmovie('action', 'movie')));
        dispatch(setComedyMovie(await getgenresolarmovie('comedy', 'movie')));
        dispatch(setRomanceMovie(await getgenresolarmovie('romance', 'movie')));
        dispatch(setTvShow(await getherosolarmovie('tv')));
        getData();
    }

    const laodDataFMovies = async () => {
        dispatch(setMovies(await getherofmovies()));
        dispatch(setPopularMovie(await getherofmovies('movie')));
        dispatch(setHorrorMovie(await getgenrefmovies('horror', 'movie')));
        dispatch(setActionMovie(await getgenrefmovies('action', 'movie')));
        dispatch(setComedyMovie(await getgenrefmovies('comedy', 'movie')));
        dispatch(setRomanceMovie(await getgenrefmovies('romance', 'movie')));
        dispatch(setTvShow(await getherofmovies('tv')));
        getData();
    }

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('userData')
            if (value !== null) {
                const userData = JSON.parse(value) || []
                if (userData.length > 0) {
                    dispatch(getData(userData))
                }
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Tabs' }],
                })
            } else {
                const userData = JSON.parse(value) || []
                await AsyncStorage.setItem('userData', JSON.stringify(userData))
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'StartUp' }]
                })
            }
        } catch (error) {
            alert("Error: " + error);
        }
    }

    const loadPermission = async () => {
        try {
            // add read, write permissions
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            );
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );
        } catch (error) {
            alert("Error: " + error);
        }
    }

    const testApi = async () => {
        console.log(await solarmovie.hero())
    }
    const getRandomNumber = () => {
        const randomNumber = Math.floor(Math.random() * loadingMessage.default.length) + 1;
        return randomNumber
    }

    const [loading, setLoading] = useState('Loading...');
    const changeMessage = () => {
        setTimeout(() => {
           setLoading(loadingMessage.default[getRandomNumber()]);
           changeMessage();
        }, 3000)
    }
    const getDatas = async () => {
        await dispatch(getprofileData(await AsyncStorage.getItem('userProfile')))
        if(provider !== '') {
            switch(provider) {
                case "flixhq":
                    laodDataFlixHQ()
                    break;
                case "solarmovie":
                    laodDataSolarMovie()
                    break;
                case "fmovies":
                    laodDataFMovies()
                    break;
                default:
                    laodDataFlixHQ()
                    break;
            }
        } else {
            laodDataFlixHQ()
        }
    }

    useEffect(() => {
        if(provider !== '') {
            switch(provider) {
                case "flixhq":
                    laodDataFlixHQ()
                    break;
                case "solarmovie":
                    laodDataSolarMovie()
                    break;
                case "fmovies":
                    laodDataFMovies()
                    break;
                default:
                    laodDataFlixHQ()
                    break;
            }
        } 
    }, [provider])

    useEffect(() => {
        changeMessage()
        loadPermission()
        getDatas()
    }, [])

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.black,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Image
                source={require('~/assets/logo/logo.png')}
                style={{
                    width: 200,
                }}
            />
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

        </View>
    )
}

export default Splash