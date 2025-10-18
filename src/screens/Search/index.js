import { View, Text, TextInput, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import { debounce } from "lodash";
import { useSelector } from 'react-redux';

import {
  search_movie,
  search_tv,
} from '~/api/tmdb';
import MovieList from '~/components/MovieList';
import { colors } from '~/constants/theme';




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

  const searchMovies = async () => {
    try {
      const results = await search_movie(search);
      setMovies(results);
    } catch (error) {
      console.error(error);
    }
  };

  const searchTvShows = async () => {
    try {
      const results = await search_tv(search);
      setTvShows(results);
    } catch (error) {
      console.error(error);
    }
  };

  const handler = useCallback(debounce(() =>{
    if(search.length > 2){
      searchMovies();
      searchTvShows();
    }
  } , 1000), [search]);


  useEffect(() => {
    handler();
    return handler.cancel;
  }, [search, handler]);



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
            onChangeText={text => setSearch(text)}
            placeholder="Search for movies or TV shows"
            placeholderTextColor={colors.grey}
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
