import { View, Text, Modal, Image, TouchableOpacity, ScrollView, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, sizes } from '../../constants/theme';

const CreditsModal = ({ isOpen, onClose }) => {


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
                    >Flick v3</Text>
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
                            }}
                        >
                            Flick (v3) is a Free Movie Streaming and Download app, no ads, no accounts, no bullshits, just free!.
                            {'\n\n'}
                            Watch and Download Free movies and TV Shows, HD movies directly on your mobile device.
                            {'\n\n'}
                            BTW Elijah temporary pa ni nga credits gi tapolan ko
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
                                textAlign: 'center'
                            }}
                        >
                            KrazyDevs LLC (not a real company){'\n\n'}
                            Main Developers{'\n'}
                            ----------------
                            {'\n'}
                            Elijah Abgao{'\n'}(https://github.com/skeltonmod){'\n'}for the "theflix.to" provider
                            {'\n'}{'\n'}
                            Wendale Dy{'\n'}(https://github.com/sheeshcake) {'\n'}for making this shit,
                            {'\n\n'}
                            ***************
                            {'\n\n'}
                            The Flower Boyz{'\n'}
                            ----------------
                            {'\n'}
                            Cedric Matthew Verdida{'\n'}The API pirate KING!{'\n'}{'\n'}
                            Denny Marc Maquiling{'\n'}Big Boss{'\n'}{'\n'}
                            James Patrick Apal{'\n'}ASA NA MAN ANG SPOFITY NATO NGA APP!!{'\n\n'}
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
                            }}
                        >
                            Any legal issues regarding the content on this application should be taken up with the actual file hosts and providers themselves as we are not affiliated with them. In case of copyright infringement, please directly contact the responsible parties or the streaming websites. The app is purely for educational and personal use. Flick(v3) does not host any content on the app, and has no control over what media is put up or taken down. Flick(v3) functions like any other search engine, such as Google. Flick(v3) does not host, upload or manage any videos, films or content. It simply crawls, aggregates and displayes links in a convenient, user-friendly interface. It merely scrapes 3rd-party websites that are publicly accessable via any regular web browser. It is the responsibility of user to avoid any actions that might violate the laws governing his/her locality. Use Flick(v3) at your own risk.
                        </Text>
                    </ScrollView>
                    <View
                        style={{
                            marginTop: 20,
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