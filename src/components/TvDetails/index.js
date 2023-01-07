import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import tmdb from '~/api/tmdb'
import solarmovie from '~/api/solarmovie';
import {colors} from '~/constants/theme'


const TvDetails = ({ setSelectedSeason, seasonData, selectedSeason }) => {


    return (
        <View>
            <View
                style={{
                    padding: 10,
                }}
            >
                <Text
                    style={{
                        color: colors.white,
                    }}
                >{selectedSeason?.overview}</Text>
            </View>
            {
                seasonData?.length > 0 ? 
                    <Picker
                        selectedValue={selectedSeason?.id}
                        style={{
                            color: colors.white,
                        }}
                        onValueChange={(itemValue, itemIndex) => {
                            setSelectedSeason(seasonData.find(season => season.id === itemValue))
                        }
                        }>
                        {seasonData?.map(season => (
                            <Picker.Item style={{
                                color: colors.black,
                            }} key={season.id} label={season.title} value={season.id} />
                        ))}
                    </Picker>
                : 
                <View style={{
                    padding: 10,
                }}>
                    <ActivityIndicator size="large" color={colors.red} />
                </View>

            }
        </View>
    )
}

export default TvDetails