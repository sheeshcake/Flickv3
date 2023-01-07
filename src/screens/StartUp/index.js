import { View, Text, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { colors } from '~/constants/theme'
import { useDispatch } from 'react-redux'
import {
    setProvider,
} from '~/redux/profileSlice'

const StartUp = ({ navigation }) => {
    const dispatch = useDispatch()
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Image
                source={require('~/assets/logo/logo.png')}
                style={{
                    width: 200,
                    marginBottom: 20,
                }}
            />
            <Text
                style={{
                    color: colors.white,
                    fontSize: 20,
                    textAlign: 'center',
                    paddingHorizontal: 20,
                }}
            >
                Welcome, cinephile. :D {'\n\n'}
                Flick v3 is a new way to watch movies.
                Unlimited movies, TV shows, and more.
            </Text>
            <TouchableOpacity
                onPress={() => {
                    dispatch(setProvider('flixhq'))
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Tabs' }]
                    })
                }}
                style={{
                    backgroundColor: colors.red,
                    padding: 10,
                    marginTop: 20,
                    borderRadius: 10,
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: 20,
                        textAlign: 'center',
                    }}
                >
                    Lets Go!
                </Text>
            </TouchableOpacity>
        </View>
    )
}



export default StartUp