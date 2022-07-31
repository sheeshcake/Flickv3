import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import tmdb from '~/api/tmdb'


const TvDetails = ({ tv, setSeasonData }) => {

    const [tvDetails, setTvDetails] = React.useState({})
    const [selectedSeason, setSelectedSeason] = React.useState();

    const getTvDetails = async () => {
        const response = await tmdb.get_tv_details(tv.id)
        setSeasonData(response.seasons)
        setTvDetails(response)
        setSelectedSeason(response.seasons[0].id)
    }

    useEffect(() => {
        getTvDetails()
    }, [tv])


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
                    setSelectedSeason(tvDetails?.seasons.find(season => season.id === itemValue))
                    setSeasonData(tvDetails?.seasons.find(season => season.id === itemValue))
                }
                }>
                {tvDetails?.seasons?.map(season => (
                    <Picker.Item key={season.id} label={season.name} value={season.id} />
                ))}
            </Picker>
        </View>
    )
}

export default TvDetails