import React, {Component} from 'react';
import {Text, TextInput, UIManager, Platform, AppState} from 'react-native';
import {Provider} from 'react-redux';
import {ThemeProvider} from 'react-native-elements';
import {InAppNotificationProvider} from 'react-native-in-app-notification';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
// import * as firebase from 'firebase';
import database from '@react-native-firebase/database';
import AppContainer from './src/navigation/index';
import {PersistGate} from 'redux-persist/integration/react';
import theme from './src/config/theme';
// import store, {persistor} from './src/redux/store/configureStore';
import {store, persistor} from './src/redux/store/configureStore';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/common/RootNavigation';

const STATUS_BAR_HEIGHT = getStatusBarHeight(true);
console.log('STATUS_BAR_HEIGHT', STATUS_BAR_HEIGHT);
const NOTIFICATION_HEIGHT = STATUS_BAR_HEIGHT + 80;
class App extends Component {
  constructor(props) {
    super(props);
    this.interval = null;
    this.state = {};
    this.disableScaling();
    this.setAnimation();
    // this.configureFirebase();
  }

  componentDidMount() {
    this.interval = setInterval(this.intervalFunc, 3000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  intervalFunc = () => {
    const myUsername = store.getState().user.user?.userInfo?.username;
    // console.log(myUsername);
    if (myUsername) {
      if (AppState.currentState === 'active') {
        this.interval = setInterval(() => {
          // console.log('active', myUsername);
          if (myUsername) {
            database().ref(`/online/${myUsername}`).update({
              // ...userdata.user,
              last_online: new Date().getTime(),
              status: 1,
            });
          }
        }, 60000);
      }
    }
    // else {
    //   this.interval = setInterval(this.intervalFunc, 3000);
    // }
  };

  disableScaling = () => {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;

    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
  };

  setAnimation = () => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  };

  // configureFirebase = () => {
  //   const config = {
  //     // apiKey: '',
  //     // authDomain: '',
  //     // databaseURL: '',
  //     // projectId: '',
  //     // storageBucket: '',
  //     // messagingSenderId: '',
  //     apiKey: 'AIzaSyB7_8wk2dPWEgVSHuJmBwY1q9kPsMxI-os',
  //     authDomain: 'saan-app.firebaseapp.com',
  //     databaseURL: 'https://saan-app.firebaseio.com',
  //     projectId: 'saan-app',
  //     storageBucket: 'saan-app.appspot.com',
  //     messagingSenderId: '838368327211',
  //     appId: '1:838368327211:web:52097cc9c369c3ee20dc6e',
  //     measurementId: 'G-131ZB1YFDW',
  //   };
  //   firebase.initializeApp(config);
  // };

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <InAppNotificationProvider
              closeInterval={5000}
              openCloseDuration={300}
              // height={NOTIFICATION_HEIGHT}
              // topOffset={STATUS_BAR_HEIGHT}
              backgroundColour="#f5f5f5">
              <NavigationContainer ref={navigationRef}>
                <AppContainer />
              </NavigationContainer>
            </InAppNotificationProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
