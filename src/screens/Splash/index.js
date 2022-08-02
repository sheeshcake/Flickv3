import { View, Text, Image, ActivityIndicator, PermissionsAndroid, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
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

import {
    getprofileData,
} from '~/redux/profileSlice'
import tmdb from '~/api/tmdb'
import solarmovie from '~/api/solarmovie'

const Splash = ({ navigation }) => {
    const dispatch = useDispatch()

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
        dispatch(getprofileData(await AsyncStorage.getItem('userProfile') || []));
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
            console.log(value)
            if (value !== null) {
                const userData = JSON.parse(value) || []
                if (userData.length > 0) {
                    dispatch(getData(userData))
                }
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Tabs' }]
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
    useEffect(() => {
        // loadData()
        loadData_solar()
        loadPermission()
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
        </View>
    )
}

export default Splash