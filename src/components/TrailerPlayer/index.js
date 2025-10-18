import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '~/constants/theme';
import WebviewScrapper from '../WebviewScrapper';

const TrailerPlayer = ({
  trailerVideo,
  movieImage,
  movieId,
  season,
  episode,
  movieType,
  onBackButtonPress,
  onVideoScraped,
}) => {

  // create an animation value
  const fadeAnim = useRef(new Animated.Value(1)).current;


  // on 3 seconds, fade out the image
  useEffect(() => {
    setTimeout(() => {
      fadeAnim.setValue(1);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 3000);
  }, []);

  return (
    <View style={{
      height: 255,
      width: '100%',
      position: 'relative',
      zIndex: -70,
      marginBottom: -70,
    }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 4,
          }}
          onPress={onBackButtonPress}>
          <Icon name="arrow-left" size={25} color={colors.white} />
        </TouchableOpacity>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,1)']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
          }}
        />

        <LinearGradient
          colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0.2)', 'transparent']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            opacity: fadeAnim,
          }}>
          <Image
            source={{ uri: movieImage }}
            style={{
              flex: 1,
              resizeMode: 'cover',
            }}
          />
        </Animated.View>
      </View>
      <WebView
        source={{ uri: trailerVideo }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
      { movieId && (
        movieType == 'tv' && season && episode ? (
          <WebviewScrapper
            movieId={movieId}
            season={season}
            episode={episode}
            movieType={movieType}
            onScraped={onVideoScraped}
          />
        ) : movieType == 'movie' && (
          <WebviewScrapper
            movieId={movieId}
            movieType={movieType}
            season={null}
            episode={null}
            onScraped={onVideoScraped}
          />
        ))}
    </View>
  );
};

export default TrailerPlayer;
