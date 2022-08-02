import { View, Text, TextInput, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useCallback } from 'react'
import MovieList from '~/components/MovieList';

import { colors } from '~/constants/theme';
import { ScrollView } from 'react-native-gesture-handler';
import { debounce } from "lodash";
import tmdb from '~/api/tmdb';
import solarmovie from '~/api/solarmovie';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Search = ({navigation}) => {
  const {
    popular_movie,
    tv_show
  } = useSelector(state => state.home)
  const [search, setSearch] = React.useState('');
  const [movies, setMovies] = React.useState([]);
  const [tvShows, setTvShows] = React.useState([]);
  // const [anime, setAnime] = React.useState([]);

  const get_datas = async () => {
    setMovies(await tmdb.popular_movie());
    setTvShows(await tmdb.popular_tv());
    // setAnime(await tmdb.anime());
  }

  const get_search = async () => {
    setMovies(await tmdb.search_movie(search));
    setTvShows(await tmdb.search_tv(search));
    // setAnime(await tmdb.search_anime(search));
  }


  const get_datas_solar = async () => {
    setMovies(popular_movie);
    setTvShows(tv_show);
  }

  const get_search_solar = async () => {
    setMovies(await solarmovie.search_movie(search));
    setTvShows(await solarmovie.search_tv(search));
  }
  const handler = useCallback(debounce(get_search_solar , 2000), [search]);
  useEffect(() => {
    // get_datas();
    get_datas_solar();
  }, []);

  useEffect(() => {
    if(search == ""){
      get_datas_solar();
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
