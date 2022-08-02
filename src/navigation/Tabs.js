import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import Home from "~/screens/Home";
import Search from "~/screens/Search";
import Settings from "~/screens/Settings";
import { colors, sizes } from '~/constants/theme'


import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Tab = createBottomTabNavigator()

const Tabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarOptions: {
                    activeTintColor: colors.primary,
                    inactiveTintColor: colors.white,
                    style: {
                        backgroundColor: colors.black,
                    }
                },
                tabBarStyle: {
                    backgroundColor: colors.black,
                    borderTopWidth: 0,
                    height: sizes.width * 0.13,
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                style={{
                    backgroundColor: colors.black
                }}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="home"
                            size={sizes.width * 0.07}
                            color={focused ? colors.red : colors.white}
                        />
                    )
                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="magnify"
                            size={sizes.width * 0.07}
                            color={focused ? colors.red : colors.white}
                        />
                    )
                }}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="cog"
                            size={sizes.width * 0.07}
                            color={focused ? colors.red : colors.white}
                        />
                    )
                }}
            />
        </Tab.Navigator>
    )
}

export default Tabs;