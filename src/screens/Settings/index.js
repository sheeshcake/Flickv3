import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, sizes } from '~/constants/theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import {
    setOpenSubtitleToken
} from '~/redux/profileSlice'
import AsyncStorage from '@react-native-community/async-storage'

import { useSelector } from 'react-redux';
import opensubtitle from '~/api/opensubtitle';


const Settings = ({ navigation }) => {
    const dispatch = useDispatch();
    const {
        myList,
        continueWatching,
        downloads,
        provider,
        open_subtitle,
        open_subtitle_token
    } = useSelector(state => state.profile);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    const loginOpenSubtitle = async () => {
        const res = await opensubtitle.login(username, password);
        if (res) {
            try {
                await AsyncStorage.setItem('userProfile', JSON.stringify({
                    myList: myList,
                    continueWatching: continueWatching,
                    downloads: downloads,
                    provider: provider,
                    open_subtitle: {
                        username: username,
                        password: password,
                    },
                    open_subtitle_token: res.token,
                }))
                console.log(await AsyncStorage.getItem("userProfile"))
            } catch (err) {
                console.log(err)
            }
            dispatch(setOpenSubtitleToken({
                username: username,
                password: password,
                token: res.token
            }));
        }
    }

    const logoutOpenSubtitle = async () => {
        await opensubtitle.logout(token);
        try {
            await AsyncStorage.setItem('userProfile', JSON.stringify({
                myList: myList,
                continueWatching: continueWatching,
                downloads: downloads,
                provider: provider,
                open_subtitle: {
                    username: '',
                    password: '',
                },
                open_subtitle_token: '',
            }))
            console.log(await AsyncStorage.getItem("userProfile"))
        } catch (err) {
            console.log(err)
        }
        dispatch(setOpenSubtitleToken({
            username: '',
            password: '',
            token: ''
        }));
    }


    useEffect(() => {
        setToken(open_subtitle_token);
        setUsername(open_subtitle.username);
    }, [open_subtitle_token]);



    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.black,
            }}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    maxHeight: sizes.width * 0.2,
                }}
            >
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: "flex-start",
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                        style={{
                            padding: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon
                            name="arrow-left"
                            size={sizes.width * 0.05}
                            color={colors.white}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: "flex-start",

                    }}
                >
                    <Text
                        style={{
                            color: colors.white,
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                    >
                        Settings
                    </Text>
                </View>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: "flex-start",
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                        style={{
                            padding: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon
                            name="arrow-left"
                            size={sizes.width * 0.05}
                            color={colors.black}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView
                style={{
                    flex: 1
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        backgroundColor: colors.darkGray,
                        margin: sizes.width * 0.05,
                        padding: sizes.width * 0.05,
                        borderRadius: 10,
                        marginBottom: sizes.width * 0.05,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: colors.white,
                        }}
                    >
                        OpenSubtitle
                    </Text>
                    {token == "" ? (
                        <>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.white,
                                    paddingHorizontal: 20,
                                    borderRadius: 10,
                                    marginVertical: 20,
                                }}
                            >
                                <Icon
                                    name="account"
                                    size={20}
                                    color={colors.black}
                                />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        backgroundColor: colors.white,
                                        color: colors.black,
                                        marginHorizontal: 10,
                                    }}
                                    onChangeText={setUsername}
                                    value={username}
                                />
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.white,
                                    paddingHorizontal: 20,
                                    borderRadius: 10,
                                    marginVertical: 20,
                                }}
                            >
                                <Icon
                                    name="key"
                                    size={20}
                                    color={colors.black}
                                />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        backgroundColor: colors.white,
                                        color: colors.black,
                                        marginHorizontal: 10,
                                    }}
                                    secureTextEntry={true}
                                    onChangeText={setPassword}
                                    value={password}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    loginOpenSubtitle();
                                }
                                }
                                style={{
                                    flex: 1,
                                    maxWidth: sizes.width * 0.3,
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.white,
                                    paddingVertical: 10,
                                    paddingHorizontal: 20,
                                    borderRadius: 10,
                                    marginVertical: 20,
                                }}
                            >
                                <Icon
                                    name="login"
                                    size={20}
                                    color={colors.black}
                                />
                                <Text
                                    style={{
                                        flex: 1,
                                        backgroundColor: colors.white,
                                        color: colors.black,
                                        marginHorizontal: 10,
                                    }}
                                >
                                    Login
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: sizes.width * 0.05,
                                marginTop: sizes.width * 0.05,
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.white,
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}
                            >Logged In as {username}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    logoutOpenSubtitle();
                                }}
                                style={{
                                    backgroundColor: colors.white,
                                    paddingHorizontal: 20,
                                    borderRadius: 10,
                                    marginHorizontal: 10,
                                    marginLeft: sizes.width * 0.05,
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.black,
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Logout
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

export default Settings