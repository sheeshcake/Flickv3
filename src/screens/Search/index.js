import { View, Text, TextInput, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import MovieList from '~/components/MovieList';

import { colors } from '~/constants/theme';
import { ScrollView } from 'react-native-gesture-handler';

import tmdb from '~/api/tmdb';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Search = ({navigation}) => {
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

  useEffect(() => {
    get_datas();
  }, []);

  useEffect(() => {
    if (search) {
      get_search();
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
        
        { movies.length > 0 && <MovieList title="Movies" movies={movies} navigation={navigation}/> }
        { tvShows.length > 0 && <MovieList title="TV Shows" movies={tvShows} navigation={navigation}/> }
        {/* <MoviesList title="Anime" movies={[]} /> */}
      </ScrollView>
    </SafeAreaView>
  );
}


export default Search
