import React from 'react';
import Splash from '~/screens/Splash';
import StartUp from '~/screens/StartUp';
import Details from './src/screens/Details';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '~/constants/theme';
import Tabs from '~/navigation/Tabs';
import { store } from '~/redux/store'
import { Provider } from 'react-redux'
import Test from './src/screens/Test';

const Stack = createStackNavigator();

const App = () => {


  return (
    <Provider store={store}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.black
        }}
      >
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
            initialRouteName={'Splash'}
          >
            {/* <Stack.Screen
              name="Test"
              component={Test}
            /> */}
            <Stack.Screen
              name="Tabs"
              component={Tabs}
            />
            <Stack.Screen
              name="Splash"
              component={Splash}
            />
            <Stack.Screen
              name="Details"
              component={Details}
            />
            <Stack.Screen
              name="StartUp"
              component={StartUp}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  )
}

export default App;