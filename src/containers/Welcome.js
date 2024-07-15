import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import auth from '@react-native-firebase/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import colors from '../config/colors';
import images from '../config/images';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import { dispatch } from '../common/RootNavigation';
import { LoginFBMain } from '../redux/reducers/user/actions';

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  buttonView: {
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonStyle: {
    backgroundColor: colors.white,
    height: 45,
    width: '100%',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  iconContainerStyle: {
    paddingRight: 30,
  },
  btnLogoCont: {
    paddingRight: 20,
  },
  facebook: {
    backgroundColor: '#0C66FF',
  },
  titleStyle: {
    flex: 1,
    color: '#FFFFFF',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 17,
  },
  phone: {
    backgroundColor: '#FFFFFF',
  },
  phoneText: {
    color: '#FF2D55',
  },
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  w100: {
    width: '100%',
  },
  loginTextView: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  loginText: {
    color: colors.black,
    fontSize: 17,
  },
  loginLink: {
    color: colors.white,
  },
  // logoView: {
  //   width: '100%',
  //   paddingVertical: 30,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  sponsorContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sponsorText: {
    color: colors.black,
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 10,
  },
  sponsorImageView: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    height: 44,
    borderRadius: 22,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sponsorImageOut: {paddingHorizontal: 5},
  sponsorImage: {height: 30, maxWidth: 80},
  logoView: {
    width: '100%',
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBackground: {
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.white,
    // marginTop: 20,
  },
  logoImage: {
    height: 60,
    width: 60,
  },
  appTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 5,
    marginBottom: 5,
  },
  subText: {color: '#FFF', fontSize: 26, marginVertical: 10},
  absImage: {
    width: width,
    height: height,
    position: 'absolute',
    left: -width * 0.4,
    bottom: 0,
    resizeMode: 'contain',
    transform: [{rotate: '-30deg'}],
  },
});

class Welcome extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  signIn = () => {
    console.log('signIn');
    const {navigation} = this.props;
    navigation.navigate('Login');
  };

  signUp = () => {
    console.log('signUp');
    const {navigation} = this.props;
    navigation.navigate('Signup');
  };

  phoneLogin = () => {
    const {navigation} = this.props;
    navigation.navigate('Verify');
  };

  fbLogin = async () => {
    const {dispatch} = this.props;
    try {
      const res = await this.onFacebookButtonPress();
      console.log('Signed in with Facebook!');
      console.log(res);
      if (res.user) {
        await dispatch(LoginFBMain(res.user));
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Warning',
        error?.message || "Cant't login with facebook. please try again later!",
      );
    }
  };

  onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <Image source={images.welcomeLogo} style={styles.absImage} />
        <KeyboardAwareScrollView
          style={styles.flex}
          contentContainerStyle={styles.flexGrow}>
          <View style={styles.logoView}>
            <View style={[styles.logoBackground, styles.shadow]}>
              <Image source={images.africaLogo} style={styles.logoImage} />
            </View>
            <Text style={styles.appTitle}>SAAN App</Text>
            <Text style={styles.subText}>Connect. Network. Impact.</Text>
          </View>

          <View style={styles.w100}>
            <View style={styles.buttonView}>
              <Button
                onPress={this.fbLogin}
                title={'Connect with Facebook'}
                activeOpacity={0.9}
                titleStyle={styles.titleStyle}
                buttonStyle={[styles.buttonStyle, styles.facebook]}
                iconContainerStyle={styles.iconContainerStyle}
                icon={
                  <Icon
                    name="logo-facebook"
                    type="ionicon"
                    color="#FFF"
                    size={26}
                    containerStyle={styles.btnLogoCont}
                  />
                }
              />
              <Button
                title={'Connect with Phone number'}
                activeOpacity={0.9}
                onPress={this.phoneLogin}
                titleStyle={[styles.titleStyle, styles.phoneText]}
                buttonStyle={styles.buttonStyle}
                iconContainerStyle={styles.iconContainerStyle}
                icon={
                  <Icon
                    name="mobile1"
                    type="antdesign"
                    color="#FF2D55"
                    size={26}
                    containerStyle={styles.btnLogoCont}
                  />
                }
              />
            </View>
          </View>

          <View style={styles.w100}>
            <View style={styles.loginTextView}>
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text onPress={this.signIn} style={styles.loginLink}>
                  Sign In
                </Text>
              </Text>
            </View>

            <View style={styles.loginTextView}>
              <Text style={styles.loginText}>
                Don't have an account?{' '}
                <Text onPress={this.signUp} style={styles.loginLink}>
                  Sign up
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.sponsorContainer}>
            <Text style={styles.sponsorText}>
              {
                'Made possible through the \n African German Youth Initiative \n with support from:'
              }
            </Text>

            <View style={styles.sponsorImageView}>
              <TouchableOpacity style={styles.sponsorImageOut}>
                <Image
                  source={images.logo4Logo}
                  resizeMode="contain"
                  style={styles.sponsorImage}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sponsorImageOut}>
                <Image
                  source={images.logo5Logo}
                  resizeMode="contain"
                  style={styles.sponsorImage}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sponsorImageOut}>
                <Image
                  source={images.logo6Logo}
                  resizeMode="contain"
                  style={styles.sponsorImage}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sponsorImageOut}>
                <Image
                  source={images.logo7Logo}
                  resizeMode="contain"
                  style={styles.sponsorImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

Welcome.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

Welcome.defaultProps = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  // loginUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
