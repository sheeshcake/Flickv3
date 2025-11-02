import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { sizes, colors } from '~/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const ContinueWatchingList = ({ items, navigation, onRemove }) => {
  if (!items || items.length === 0) {
    return null;
  }

  const formatProgress = (progress, duration) => {
    if (!duration || duration === 0) return 0;
    return Math.min((progress / duration) * 100, 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View
      style={{
        paddingHorizontal: sizes.width * 0.03,
        paddingTop: sizes.width * 0.05,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          marginBottom: 10,
          color: colors.white,
          fontWeight: 'bold',
        }}
      >
        Continue Watching
      </Text>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item, index) => {
          const progressPercent = formatProgress(item.progress, item.duration);
          
          return (
            <View
              style={{
                flex: 1,
                width: sizes.width * 0.25,
                justifyContent: 'center',
                marginRight: 10,
                marginBottom: 10,
              }}
              key={`${item.id}-${item.seasonNumber}-${item.episodeNumber}-${index}`}
            >
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  position: 'relative',
                }}
                activeOpacity={0.6}
                onPress={() => {
                  navigation.push('Details', {
                    movie: {
                      id: item.id,
                      title: item.title,
                      type: item.type,
                      image: item.poster,
                      overview: item.overview,
                    },
                    continueWatchingData: {
                      progress: item.progress,
                      duration: item.duration,
                      seasonNumber: item.seasonNumber,
                      episodeNumber: item.episodeNumber,
                    }
                  });
                }}
              >
                {/* Remove button */}
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 5,
                    zIndex: 100,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    if (onRemove) {
                      onRemove(item);
                    }
                  }}
                >
                  <Icon name="close" size={16} color={colors.white} />
                </TouchableOpacity>

                {/* Poster Image */}
                <Image
                  source={{
                    uri: item.poster,
                  }}
                  style={{
                    width: sizes.width * 0.25,
                    height: sizes.height * 0.22,
                    borderRadius: 10,
                  }}
                />

                {/* Play icon overlay */}
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Icon name="play" size={24} color={colors.white} />
                  </View>
                </View>

                {/* Progress bar at bottom */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                >
                  <View
                    style={{
                      height: '100%',
                      width: `${progressPercent}%`,
                      backgroundColor: colors.red,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: progressPercent === 100 ? 10 : 0,
                    }}
                  />
                </View>
              </TouchableOpacity>

              {/* Title and episode info */}
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  width: '100%',
                  marginTop: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.white,
                    fontWeight: 'bold',
                  }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                {item.type === 'tv' && item.seasonNumber && item.episodeNumber && (
                  <Text
                    style={{
                      fontSize: 10,
                      color: colors.gray,
                      marginTop: 2,
                    }}
                    numberOfLines={1}
                  >
                    S{item.seasonNumber} E{item.episodeNumber}
                    {item.episodeTitle ? ` • ${item.episodeTitle}` : ''}
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: 10,
                    color: colors.gray,
                    marginTop: 2,
                  }}
                >
                  {formatTime(item.progress)} / {formatTime(item.duration)}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ContinueWatchingList;
