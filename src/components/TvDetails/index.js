import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import tmdb from '~/api/tmdb'
import solarmovie from '~/api/solarmovie';
import {colors, sizes} from '~/constants/theme'
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
                    <SelectDropdown
                        data={seasonData}
                        defaultValue={selectedSeason}
                        buttonStyle={{
                            color: colors.white,
                            backgroundColor: colors.black,
                            borderColor: colors.white,
                            borderWidth: 1,
                            borderRadius: 10,
                            margin: 10,
                        }}
                        renderDropdownIcon={() => {
                            return <Icon
                                name="chevron-down"
                                size={sizes.width * 0.08}
                                color={colors.white}
                            />
                        }}
                        dropdownIconPosition="right"
                        buttonTextStyle={{
                            color: colors.white
                        }}
                        onSelect={(selectedItem, index) => {
                            setSelectedSeason(seasonData?.find(season => season.id === selectedItem?.id))
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem?.title
                        }}
                        rowTextForSelection={(item, index) => {
                            return item.title
                        }}
                    />
                    // <View
                    //     style={{
                    //         color: colors.white,
                    //         borderColor: colors.white,
                    //         borderWidth: 1,
                    //         borderRadius: 10,
                    //         margin: 10,
                    //     }}
                    // >
                    //     <Picker
                    //         themeVariant="dark"
                    //         selectedValue={selectedSeason?.id}
                    //         style={{
                    //             color: colors.white,
                    //         }}
                    //         onValueChange={(itemValue, itemIndex) => {
                    //             setSelectedSeason(seasonData.find(season => season.id === itemValue))
                    //         }
                    //         }>
                    //         {seasonData?.map(season => (
                    //             <Picker.Item style={{
                    //                 color: colors.white,
                    //             }} key={season.id} label={season.title} value={season.id} />
                    //         ))}
                    //     </Picker>
                    // </View>
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