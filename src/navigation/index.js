import React, {Component} from 'react';
// import {View, Text} from 'react-native';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  createStackNavigator,
  TransitionPresets,
  TransitionSpecs,
} from '@react-navigation/stack';
import {withInAppNotification} from 'react-native-in-app-notification';
import messaging from '@react-native-firebase/messaging';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import colors from '../config/colors';
import {Icon} from 'react-native-elements';
import Welcome from '../containers/Welcome';
import Signup from '../containers/Signup';
import Login from '../containers/Login';
import Verify from '../containers/Verify';
import PhoneVerification from '../containers/PhoneVerification';
import Messages from '../containers/Messages';
import MessageDetails from '../containers/MessageDetails';
import NoticeBoard from '../containers/NoticeBoard';
import Opportunities from '../containers/Opportunities';
import Events from '../containers/Events';
import EventDetails from '../containers/EventDetails';
import CreateEvent from '../containers/CreateEvent';
import EventCalendar from '../containers/EventCalendar';
import Home from '../containers/Home';
import Comments from '../containers/Comments';
import StartPost from '../containers/StartPost';
import Notifications from '../containers/Notifications';
import MyProfile from '../containers/MyProfile';
import EditProfile from '../containers/EditProfile';
import FindFriends from '../containers/FindFriends';
import NearMyLocation from '../containers/NearMyLocation';
import NearMyLocationEvents from '../containers/NearMyLocationEvents';
import WebViewPage from '../containers/WebViewPage';

// import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const options = {
  header: () => null,
  gestureEnabled: true,
  cardOverlayEnabled: true,
  ...TransitionSpecs.TransitionIOSSpec,
  ...TransitionPresets.SlideFromRightIOS,
};

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {};
  }

  componentDidMount() {
    this.unsubscribe = messaging().onMessage(this.onMessage);
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  onMessage = async (remoteMessage) => {
    console.log('remoteMessage', remoteMessage);
    const {showNotification} = this.props;
    if (remoteMessage) {
      const {data} = remoteMessage;
      showNotification({
        title: data.title || '',
        message: data.body || '',
        icon: {uri: data.icon || ''},
        onPress: () => {},
      });
    }
  };

  loginStack = () => {
    return (
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} options={options} />
        <Stack.Screen name="Signup" component={Signup} options={options} />
        <Stack.Screen name="Login" component={Login} options={options} />
        <Stack.Screen name="Verify" component={Verify} options={options} />
        <Stack.Screen
          name="PhoneVerification"
          component={PhoneVerification}
          options={options}
        />
        <Stack.Screen
          name="WebViewPage"
          component={WebViewPage}
          options={options}
        />
      </Stack.Navigator>
    );
  };

  homeStack = () => {
    return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={options} />
        <Stack.Screen name="Comments" component={Comments} options={options} />
        <Stack.Screen
          name="StartPost"
          component={StartPost}
          options={options}
        />
        <Stack.Screen
          name="FindFriends"
          component={FindFriends}
          options={{
            ...options,
            tabBarVisible: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  streamsStack = () => {
    return (
      <Stack.Navigator initialRouteName="NoticeBoard">
        <Stack.Screen
          name="NoticeBoard"
          component={NoticeBoard}
          options={options}
        />
        <Stack.Screen
          name="Opportunities"
          component={Opportunities}
          options={options}
        />
        <Stack.Screen name="Events" component={Events} options={options} />
        <Stack.Screen
          name="CreateEvent"
          component={CreateEvent}
          options={options}
        />
        <Stack.Screen
          name="EventDetails"
          component={EventDetails}
          options={options}
        />
        <Stack.Screen
          name="EventCalendar"
          component={EventCalendar}
          options={options}
        />
        <Stack.Screen
          name="NearMyLocationEvents"
          component={NearMyLocationEvents}
          options={{
            ...options,
            tabBarVisible: false,
          }}
        />
        <Stack.Screen
          name="WebViewPage"
          component={WebViewPage}
          options={options}
        />
      </Stack.Navigator>
    );
  };

  notificationStack = () => {
    return (
      <Stack.Navigator initialRouteName="Notifications">
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={options}
        />
      </Stack.Navigator>
    );
  };

  messageStack = () => {
    return (
      <Stack.Navigator initialRouteName="Message">
        <Stack.Screen name="Message" component={Messages} options={options} />
        <Stack.Screen
          name="MessageDetails"
          component={MessageDetails}
          options={options}
        />
        <Stack.Screen
          name="FindFriends"
          component={FindFriends}
          options={{
            ...options,
            tabBarVisible: false,
          }}
        />
        <Stack.Screen
          name="NearMyLocation"
          component={NearMyLocation}
          options={{
            ...options,
            tabBarVisible: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  profileStack = () => {
    return (
      <Stack.Navigator initialRouteName="MyProfile">
        <Stack.Screen
          name="MyProfile"
          component={MyProfile}
          options={options}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={options}
        />
      </Stack.Navigator>
    );
  };

  tabStack = () => {
    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: colors.primary,
        }}>
        <Tab.Screen
          name="Home"
          component={this.homeStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Streams"
          component={this.streamsStack}
          options={{
            tabBarLabel: 'Board',
            tabBarIcon: ({color, size}) => (
              <Icon name="tv" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Message"
          component={this.messageStack}
          options={{
            tabBarLabel: 'Messages',
            tabBarIcon: ({color, size}) => (
              <Icon name="message" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Notification"
          component={this.notificationStack}
          options={{
            tabBarLabel: 'Notifications',
            tabBarIcon: ({color, size}) => (
              <Icon name="notifications-none" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={this.profileStack}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({color, size}) => (
              <Icon name="account-circle" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

  drawerStack = () => {
    return (
      <Drawer.Navigator initialRouteName="TabStack">
        <Drawer.Screen name="TabStack" component={this.tabStack} />
      </Drawer.Navigator>
    );
  };

  render() {
    // const {
    //   auth: {user},
    // } = this.props;
    // console.log(user);
    const {user} = this.props;
    const logined = !!user?.user?.userInfo;
    let initialRouteName = 'LoginStack';
    if (logined) {
      initialRouteName = 'DrawerStack';
    }
    return (
      <Stack.Navigator initialRouteName={initialRouteName}>
        {!logined && (
          <Stack.Screen
            name="LoginStack"
            component={this.loginStack}
            options={{header: () => null}}
          />
        )}
        {logined && (
          <Stack.Screen
            name="DrawerStack"
            component={this.tabStack}
            options={{header: () => null}}
          />
        )}
      </Stack.Navigator>
    );
  }
}

const mapStateToProps = (state) => ({
  // auth: state.auth,
  user: state.user,
});

const mapDispatchToProps = {};

export default withInAppNotification(
  connect(mapStateToProps, mapDispatchToProps, null, {
    forwardRef: true,
  })(AppContainer),
);
