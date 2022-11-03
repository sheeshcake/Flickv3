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
} from '~/redux/profileSlice'
import tmdb from '~/api/tmdb'
import solarmovie from '~/api/solarmovie'

const Splash = ({ navigation }) => {
    const loadingMessage = require('~/constants/loadingmessage.js');
    const dispatch = useDispatch()
    const {
        provider
    } = useSelector(state => state.profile)

    const loadData = async () => {
        dispatch(setMovies(await tmdb.hero()));
        dispatch(setPopularMovie(await tmdb.popular_movie()));
        dispatch(setHorrorMovie(await tmdb.horror_movie()));
        dispatch(setActionMovie(await tmdb.action_movie()));
        dispatch(setComedyMovie(await tmdb.comedy_movie()));
        dispatch(setRomanceMovie(await tmdb.romance_movie()));
        dispatch(setTvShow(await tmdb.popular_tv()));
        getData();
    }

    const loadData_solar = async () => {
        dispatch(setMovies(await solarmovie.hero()));
        dispatch(setPopularMovie(await solarmovie.popular_movie()));
        dispatch(setHorrorMovie(await solarmovie.horror_movie()));
        dispatch(setActionMovie(await solarmovie.action_movie()));
        dispatch(setComedyMovie(await solarmovie.comedy_movie()));
        dispatch(setRomanceMovie(await solarmovie.romance_movie()));
        dispatch(setTvShow(await solarmovie.popular_tv()));
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
            console.log(error)
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
            console.log(error);
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
            provider == "solarmovie" ? loadData_solar() : loadData()
        } else {
            loadData()
        }
    }

    useEffect(() => {
        if(provider !== '') {
            provider == "solarmovie" ? loadData_solar() : loadData()
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