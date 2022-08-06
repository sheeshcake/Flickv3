import { View, Text, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, sizes } from '~/constants/theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    setOpenSubtitleToken,
    setProvider,
    setPlayerType
} from '~/redux/profileSlice'
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage'

import { useSelector, useDispatch } from 'react-redux';
import opensubtitle from '~/api/opensubtitle';


const Settings = ({ navigation }) => {
    const dispatch = useDispatch();
    const {
        myList,
        continueWatching,
        downloads,
        provider,
        open_subtitle,
        open_subtitle_token,
        player_type
    } = useSelector(state => state.profile);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [providers, setProviders] = useState([
        { label: 'The Flix', value: 'theflix' },
        { label: 'Solar Movies', value: 'solarmovie' },
    ]);
    const [players, setPlayers] = useState([
        { label: 'YoutubePlayer(beta)', value: 'youtube' },
        { label: 'Legacy', value: 'legacy' },
    ]);
    const [player, setPlayer] = useState('legacy');
    const [selectedProvider, setSelectedProvider] = useState(provider);

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
                    player_type: player_type,
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
                player_type: player_type,
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
    const updatePlayerType = async () => {
        try {
            await AsyncStorage.setItem('userProfile', JSON.stringify({
                myList: myList,
                continueWatching: continueWatching,
                downloads: downloads,
                provider: selectedProvider,
                open_subtitle: open_subtitle,
                open_subtitle_token: open_subtitle_token,
                player_type: player
            }))
        } catch (err) {
            console.log(err)
        }
        dispatch(setPlayerType(player))
        alert("Media Player Changed!")
    }


    const updateProvider = async () => {
        try {
            await AsyncStorage.setItem('userProfile', JSON.stringify({
                myList: myList,
                continueWatching: continueWatching,
                downloads: downloads,
                provider: selectedProvider,
                open_subtitle: open_subtitle,
                open_subtitle_token: open_subtitle_token,
                player_type: player_type,
            }))
            console.log(await AsyncStorage.getItem("userProfile"))
        } catch (err) {
            console.log(err)
        }
        dispatch(setProvider(selectedProvider))
        navigation.navigate("Splash");
    }


    useEffect(() => {
        setToken(open_subtitle_token);
        setUsername(open_subtitle?.username);
        setSelectedProvider(provider);
        setPlayer(player_type);
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
                        borderRadius: 5,
                        marginBottom: sizes.width * 0.01,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: colors.white,
                            marginBottom: sizes.width * 0.01,
                        }}
                    >
                        OpenSubtitle
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: colors.white,
                            marginBottom: sizes.width * 0.01,
                        }}
                    >
                        Login your OpenSubtitle account here, if you dont have one, you can create one here:
                        <Text
                            onPress={() => {
                                Linking.openURL('https://www.opensubtitles.org/en/register/signup')
                            }}
                            style={{
                                fontSize: 14,
                                color: colors.white,
                                marginBottom: sizes.width * 0.01,
                                textDecorationLine: 'underline',
                                textDecorationColor: colors.white,
                            }}
                        >
                            OpenSubtitle
                        </Text>
                    </Text>
                    {token == "" ? (
                        <>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.white,
                                    paddingHorizontal: 5,
                                    borderRadius: 5,
                                    marginVertical: 5,
                                }}
                            >
                                <Icon
                                    name="account"
                                    size={20}
                                    color={colors.black}
                                />
                                <TextInput
                                    placeholder='Username'
                                    style={{
                                        flex: 1,
                                        height: sizes.width * 0.09,
                                        backgroundColor: colors.white,
                                        color: colors.black,
                                        marginHorizontal: 10,
                                    }}
                                    placeholderTextColor={colors.gray}
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
                                    paddingHorizontal: 5,
                                    borderRadius: 5,
                                    marginVertical: 5,
                                }}
                            >
                                <Icon
                                    name="key"
                                    size={20}
                                    color={colors.black}
                                />
                                <TextInput
                                    placeholder='Password'
                                    style={{
                                        flex: 1,
                                        height: sizes.width * 0.09,
                                        backgroundColor: colors.white,
                                        color: colors.black,
                                        marginHorizontal: 10,
                                    }}
                                    placeholderTextColor={colors.gray}
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
                                    maxWidth: sizes.width * 0.25,
                                    marginTop: 5,
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.white,
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    borderRadius: 5,
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
                                        fontWeight: 'bold',
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
                                    borderRadius: 5,
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
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        backgroundColor: colors.darkGray,
                        margin: sizes.width * 0.05,
                        padding: sizes.width * 0.05,
                        borderRadius: 5,
                        marginBottom: sizes.width * 0.05,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: colors.white,
                        }}
                    >
                        Provider
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: colors.white,
                            marginBottom: sizes.width * 0.01,
                        }}
                    >
                        Select the provider you want to use.. :D
                    </Text>
                    <Picker
                        style={{
                            flex: 1,
                            backgroundColor: colors.white,
                            color: colors.black,
                            marginHorizontal: 5,
                            marginVertical: 5,
                        }}
                        selectedValue={selectedProvider}
                        onValueChange={(itemValue, itemIndex) => {
                            setSelectedProvider(itemValue)
                        }
                        }>
                        {providers?.map(provider => (
                            <Picker.Item key={provider.value} label={provider.label} value={provider.value} />
                        ))}
                    </Picker>
                    <Text
                        style={{
                            fontSize: 14,
                            color: colors.white,
                            marginBottom: sizes.width * 0.01,
                        }}
                    >
                        Changing Provider needs the app to restart.. :D
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            updateProvider()
                        }}
                        style={{
                            flex: 1,
                            maxWidth: sizes.width * 0.25,
                            marginTop: 5,
                            justifyContent: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.white,
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderRadius: 5,
                        }}
                    >
                        <Icon
                            name="restart"
                            size={20}
                            color={colors.black}
                        />
                        <Text
                            style={{
                                fontSize: 14,
                                color: colors.black,
                                fontWeight: 'bold',
                            }}
                        >
                            Restart App
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        backgroundColor: colors.darkGray,
                        margin: sizes.width * 0.05,
                        padding: sizes.width * 0.05,
                        borderRadius: 5,
                        marginBottom: sizes.width * 0.05,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: colors.white,
                        }}
                    >
                        Video Player
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: colors.white,
                            marginBottom: sizes.width * 0.01,
                        }}
                    >
                        Select a video player you want to use.. :D
                    </Text>
                    <Picker
                        style={{
                            flex: 1,
                            backgroundColor: colors.white,
                            color: colors.black,
                            marginHorizontal: 5,
                            marginVertical: 5,
                        }}
                        selectedValue={player}
                        onValueChange={(itemValue, itemIndex) => {
                            setPlayer(itemValue)
                        }
                        }>
                        {players?.map(p => (
                            <Picker.Item key={p.value} label={p.label} value={p.value} />
                        ))}
                    </Picker>
                    <Text
                        style={{
                            fontSize: 14,
                            color: colors.white,
                            marginBottom: sizes.width * 0.01,
                        }}
                    >
                        Youtube Player is in beta mode and may not work i recommend legacy for now.. :D
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            updatePlayerType()
                        }}
                        style={{
                            flex: 1,
                            maxWidth: sizes.width * 0.20,
                            marginTop: 5,
                            justifyContent: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.white,
                            paddingVertical: 10,
                            paddingHorizontal: 5,
                            borderRadius: 5,
                        }}
                    >
                        <Icon
                            name="content-save"
                            size={20}
                            color={colors.black}
                        />
                        <Text
                            style={{
                                fontSize: 14,
                                color: colors.black,
                                fontWeight: 'bold',
                            }}
                        >
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

export default Settings