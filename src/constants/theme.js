
import { Dimensions } from "react-native"

const { width, height } = Dimensions.get("window");
export const colors = {
    black : '#000000',
    red : '#E50914',
    darkRed : '#9B0000',
    white : '#FFFFFF',
    transparentBlack: 'rgba(0, 0, 0, 0.5)',
    gray: '#9B9B9B',
}

export const fonts = {
    regular : 'BebasNeue-Regular',
    bold : 'BebasNeue-Bold',
    semiBold : 'BebasNeue-SemiBold',
    light : 'BebasNeue-Light',
    thin : 'BebasNeue-Thin',
    italic : 'BebasNeue-Italic',
}

export const sizes = {
    base : 16,
    small : 12,
    medium : 16,
    large : 20,
    xlarge : 24,
    xxlarge : 32,
    width:  width,
    height: height,
}

export default {
    colors,
    fonts,
    sizes,
}
