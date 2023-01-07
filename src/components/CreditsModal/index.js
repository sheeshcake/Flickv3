import { View, Text, Modal, Image, TouchableOpacity, ScrollView, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import { colors, sizes } from '../../constants/theme';

const CreditsModal = ({ isOpen, onClose }) => {

    const [yosi, setYosi] = useState(0);
    
    const getYosi = async () => {
        try{
            const yosi = await AsyncStorage.getItem('yosi');
            if(yosi !== null) {
                setYosi(parseInt(yosi));
            } else {
                await AsyncStorage.setItem('yosi', '0');
            }
        } catch (e) {
            setYosi(0);
        }
    }

    useEffect(() => {
        getYosi();
    }, []);


    const addYosi = async () => {
        setYosi(yosi + 1);
        await AsyncStorage.setItem('yosi', `${yosi + 1}`);
    }


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isOpen}
            style={{
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 22,
                    maxHeight: sizes.height * 0.9
                }}
            >

                <View
                    style={{
                        margin: 20,
                        backgroundColor: colors.black,
                        borderRadius: 20,
                        padding: 35,
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5
                    }}
                >
                    <Image
                        source={require('~/assets/logo/logo.png')}
                        style={{
                            width: 100,
                            height: 50
                        }}
                        resizeMode="contain"
                    />
                    <Text
                        style={{
                            color: colors.white,
                            marginBottom: 20
                        }}
                    >1.4.2 beta</Text>
                    <ScrollView>
                        <Text
                            style={{
                                color: colors.white,
                                fontSize: 24,
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                        >
                            What is Flick?
                        </Text>
                        <Text
                            style={{
                                marginBottom: 50,
                                fontSize: 19,
                                color: colors.white,
                            }}
                        >
                            Flick (v3) is a Free Movie Streaming and Download app, no ads, no accounts, no bullshits, just free!.
                            {'\n\n'}
                            Watch and Download Free movies and TV Shows, HD movies directly on your mobile device.
                            {'\n\n'}
                        </Text>
                        <Text
                            style={{
                                color: colors.white,
                                fontSize: 24,
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                        >
                            Credits
                        </Text>
                        <Text
                            style={{
                                marginBottom: 50,
                                fontSize: 19,
                                textAlign: 'center',
                                color: colors.white,
                            }}
                        >
                            Main Developers{'\n'}
                            ----------------
                            {'\n'}
                            Elijah Abgao{'\n'}(https://github.com/skeltonmod){'\n'}for the provider (Providers and Scrappers)
                            {'\n'}{'\n'}
                            Wendale Dy{'\n'}(https://github.com/sheeshcake) {'\n'}for making this shit (UI/UX, Main Features, Scrapper Maintenance)
                            {'\n\n'}
                            ----------------
                            {'\n\n'}
                        </Text>
                        <Text
                            style={{
                                color: colors.white,
                                fontSize: 24,
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                        >
                            Disclaimer

                        </Text>
                        <Text
                            style={{
                                fontSize: 19,
                                color: colors.white,
                            }}
                        >
                            Any legal issues regarding the content on this application should be taken up with the actual file hosts and providers themselves as we are not affiliated with them. In case of copyright infringement, please directly contact the responsible parties or the streaming websites. The app is purely for educational and personal use. Flick(v3) does not host any content on the app, and has no control over what media is put up or taken down. Flick(v3) functions like any other search engine, such as Google. Flick(v3) does not host, upload or manage any videos, films or content. It simply crawls, aggregates and displayes links in a convenient, user-friendly interface. It merely scrapes 3rd-party websites that are publicly accessable via any regular web browser. It is the responsibility of user to avoid any actions that might violate the laws governing his/her locality. Use Flick(v3) at your own risk.
                        </Text>
                    </ScrollView>
                    <TouchableOpacity
                            style={{
                                padding: 10,
                                marginTop: 20,
                                borderRadius: 5,
                                backgroundColor: colors.white
                            }}
                            onPress={addYosi}
                        >
                            <Text
                                style={{
                                    color: colors.black,
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                }}
                            >({yosi}x)Send a Yosi to devs 🚬</Text>
                        </TouchableOpacity>
                    <View
                        style={{
                            marginTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                padding: 10,
                                marginRight: 10,
                                borderRadius: 5,
                                backgroundColor: colors.white
                            }}
                            onPress={() => Linking.openURL("https://www.paypal.com/paypalme/wfrdee")}
                        >
                            <Text
                                style={{
                                    color: colors.black,
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                }}
                            >Buy Me a Coffee☕</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                padding: 10,
                                borderRadius: 5,
                                backgroundColor: colors.white
                            }}
                            onPress={onClose}
                        >
                            <Text
                                style={{
                                    color: colors.black,
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                }}
                            >
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default CreditsModal