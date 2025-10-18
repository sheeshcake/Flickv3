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
import tmdbApi from '~/api/tmdb';
import { useSelector } from 'react-redux'
import {
    getprofileData,
    setProvider,
} from '~/redux/profileSlice'

const Splash = ({ navigation }) => {
    const loadingMessage = require('~/constants/loadingmessage.js');
    const dispatch = useDispatch()
    const {
        provider
    } = useSelector(state => state.profile)

    const loadMoviesTmdb = async () => {
        dispatch(setMovies(await tmdbApi.hero()));
        dispatch(setPopularMovie(await tmdbApi.popular_movie()));
        dispatch(setHorrorMovie(await tmdbApi.horror_movie()));
        dispatch(setActionMovie(await tmdbApi.action_movie()));
        dispatch(setComedyMovie(await tmdbApi.comedy_movie()));
        dispatch(setRomanceMovie(await tmdbApi.romance_movie()));
        dispatch(setTvShow(await tmdbApi.popular_tv()));
    }

    const proceedToHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs' }]
        })
    }
    const getLocalStorageData = async () => {
        try {
            const value = await AsyncStorage.getItem('userProfile')
            console.log(value)
            if (value) {
                const userData = JSON.parse(value) || []
                dispatch(getprofileData(userData))
                loadMoviesTmdb();
            } else {
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

    useEffect(() => {
        loadMoviesTmdb().then(() => {
            proceedToHome();
        });
    }, [provider])

    useEffect(() => {
        changeMessage()
        loadPermission()
        getLocalStorageData()
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