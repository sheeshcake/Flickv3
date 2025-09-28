// Polyfills for React Native
import 'react-native-get-random-values';

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App'

AppRegistry.registerComponent(appName, () => App);
