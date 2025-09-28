import { View, Text, TextInput, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useCallback } from 'react'
import MovieList from '~/components/MovieList';

import { colors } from '~/constants/theme';
import { ScrollView } from 'react-native-gesture-handler';
import { debounce } from "lodash";
import tmdb from '~/api/tmdb';
import solarmovie from '~/api/solarmovie';
import { useSelector } from 'react-redux';
/// import Providers Here
import { 
  searchflixhq,
  getheroflixhq
 } from "~/providers/KrazyDevsScrapper/FlixHQProvider"

 import { 
  searchsolarmovie,
  getherosolarmovie
 } from "~/providers/KrazyDevsScrapper/SolarMovieProvider"

 import {
  searchfmovies,
  getherofmovies
  } from "~/providers/KrazyDevsScrapper/FMoviesProvider"

 import {
  searchVega,
  getheroVega
  } from "~/providers/KrazyDevsScrapper/VegaProvider"

 import {
  searchVidking,
  getheroVidking
  } from "~/providers/KrazyDevsScrapper/VidkingProvider"

////
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Search = ({navigation}) => {
  const {
    popular_movie,
    tv_show
  } = useSelector(state => state.home)
  const {
    provider
  } = useSelector(state => state.profile)
  const [search, setSearch] = React.useState('');
  const [movies, setMovies] = React.useState([]);
  const [tvShows, setTvShows] = React.useState([]);
  // const [anime, setAnime] = React.useState([]);

  const get_datas_flixhq = async () => {
    setMovies(await getheroflixhq('movie'));
    setTvShows(await getheroflixhq("tv"));
  }
  const get_search_flixhq = async () => {
    searchflixhq(search).then((r) => {
      setMovies(r.filter((item) => item.type == "movie"));
      setTvShows(r.filter((item) => item.type == "tv"));
    })
  }


  const get_datas_solar = async () => {
    setMovies(await getherosolarmovie('movie'));
    setTvShows(await getherosolarmovie("tv"));
  }
  const get_search_solar = async () => {
    searchsolarmovie(search).then((r) => {
      setMovies(r.filter((item) => item.type == "movie"));
      setTvShows(r.filter((item) => item.type == "tv"));
    })
  }

  const get_datas_fmovies = async () => {
    setMovies(await getherofmovies('movie'));
    setTvShows(await getherofmovies("tv"));
  }

  const get_search_fmovies = async () => {
    searchfmovies(search).then((r) => {
      setMovies(r.filter((item) => item.type == "movie"));
      setTvShows(r.filter((item) => item.type == "tv"));
    })
  }

  const get_datas_vega = async () => {
    setMovies(await getheroVega('movie'));
    setTvShows(await getheroVega("tv"));
  }

  const get_search_vega = async () => {
    searchVega(search).then((r) => {
      setMovies(r.filter((item) => item.type == "movie"));
      setTvShows(r.filter((item) => item.type == "tv"));
    })
  }

  const get_datas_vidking = async () => {
    setMovies(await getheroVidking('movie'));
    setTvShows(await getheroVidking("tv"));
  }

  const get_search_vidking = async () => {
    searchVidking(search).then((r) => {
      setMovies(r.filter((item) => item.type == "movie"));
      setTvShows(r.filter((item) => item.type == "tv"));
    })
  }


  const handler = useCallback(debounce(() =>{
    switch(provider){
      case "flixhq":
        get_search_flixhq();
        break;
      case "solarmovie":
        get_search_solar();
        break;
      case "fmovies":
        get_search_fmovies();
        break;
      case "vega":
        get_search_vega();
        break;
      case "vidking":
        get_search_vidking();
        break;
      default:
        break;
    }
  } , 1000), [search]);


  useEffect(() => {
    switch(provider){
      case "flixhq":
        get_datas_flixhq();
        break;
      case "solarmovie":
        get_datas_solar();
        break;
      case "fmovies":
        get_datas_fmovies();
        break;
      case "vega":
        get_datas_vega();
        break;
      case "vidking":
        get_datas_vidking();
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    if(search == ""){
      switch(provider){
        case "flixhq":
          get_search_flixhq();
          break;
        case "solarmovie":
          get_datas_solar();
          break;
        case "fmovies":
          get_datas_fmovies();
          break;
        case "vega":
          get_datas_vega();
          break;
        case "vidking":
          get_datas_vidking();
          break;
        default:
          break;
      }
    }else{
      handler();
    }
  }, [search]);


  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.black,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 15,
          marginBottom: 15,
          paddingHorizontal: 15,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.white,
            paddingHorizontal: 20,
            borderRadius: 10,
          }}
        >
          <Icon
            name="magnify"
            size={20}
            color={colors.black}
          />
          <TextInput
            style={{
              flex: 1,
              backgroundColor: colors.white,
              color: colors.black,
            }}
            onChangeText={setSearch}
            value={search}
          />
        </View>
      </View>
      <ScrollView>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.white,
            marginVertical: 20,
            marginHorizontal: 20,
          }}
        >Searching For: {search}</Text>
        
        { movies?.length > 0 && <MovieList title="Movies" movies={movies} navigation={navigation}/> }
        { tvShows?.length > 0 && <MovieList title="TV Shows" movies={tvShows} navigation={navigation}/> }
        {/* <MoviesList title="Anime" movies={[]} /> */}
      </ScrollView>
    </SafeAreaView>
  );
}


export default Search
