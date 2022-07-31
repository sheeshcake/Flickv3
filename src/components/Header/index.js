import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors, sizes } from '~/constants/theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = ({
    onPressCredits
}) => {
  return (
    <View
        style={{
            flex: 1,
            position: 'absolute',
            top: 0,
            zIndex: 1,
            width: sizes.width,
            height: sizes.width * 0.15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between', 
            paddingHorizontal: sizes.width * 0.05,
            backgroundColor: colors.transparentBlack,
        }}
    >
        <Image
            source={require('~/assets/logo/logo.png')}
            style={{
                width: 70,
            }}
            resizeMode="contain"
        />
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                width: '100%',
                justifyContent: 'flex-end',
                flexDirection: 'row',
            }}
        >
            <TouchableOpacity
                onPress={onPressCredits}
                style={{
                    padding: 10,
                }}
            >
                <Icon
                    name="information-outline"
                    size={sizes.width * 0.05}
                    color={colors.white}
                />
            </TouchableOpacity>
        </View>
    </View>

  )
}

export default Header