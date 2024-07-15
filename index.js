/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
// import functions from '@react-native-firebase/functions';
import {name as appName} from './app.json';

LogBox.ignoreAllLogs(true);

if (!__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  // console.log = () => {}
}

// Use a local emulator in development
// if (__DEV__) {
//   functions().useFunctionsEmulator('http://localhost:5001');
// }

AppRegistry.registerComponent(appName, () => App);
