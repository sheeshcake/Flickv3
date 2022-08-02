import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import tmdb from '~/api/tmdb'
import solarmovie from '~/api/solarmovie';


const TvDetails = ({ setSelectedSeason, seasonData, selectedSeason }) => {


    return (
        <View>
            <View
                style={{
                    padding: 10,
                }}
            >
                <Text>{selectedSeason?.overview}</Text>
            </View>
            <Picker
                selectedValue={selectedSeason?.id}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedSeason(seasonData.find(season => season.id === itemValue))
                }
                }>
                {seasonData?.map(season => (
                    <Picker.Item key={season.id} label={season.name} value={season.id} />
                ))}
            </Picker>
        </View>
    )
}

export default TvDetails