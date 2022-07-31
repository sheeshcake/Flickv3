import { View, Text, Image, ActivityIndicator, ScrollView } from 'react-native'
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
import tmdb from '~/api/tmdb'

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

    useEffect(() => {
        loadData()
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