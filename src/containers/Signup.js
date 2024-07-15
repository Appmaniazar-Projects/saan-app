import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';
import images from '../config/images';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, CheckBox, Header, Icon, Input} from 'react-native-elements';
import {RegisterRequest} from '../redux/reducers/user/actions';

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.red,
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
  absImage: {
    width: width,
    height: height,
    position: 'absolute',
    right: -width * 0.35,
    bottom: 0,
    resizeMode: 'contain',
    transform: [{rotate: '-24deg'}],
  },
  headerCont: {
    borderBottomWidth: 0,
    backgroundColor: '#0000',
  },
  logoView: {
    width: '100%',
    paddingVertical: 5,
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
    color: colors.silver,
    fontSize: 17,
  },
  loginLink: {
    color: colors.white,
  },
  cardView: {
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 25,
  },
  topTextView: {
    paddingVertical: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bigText: {color: colors.black, fontSize: 34, marginBottom: 15},
  normalText: {color: colors.silver, fontSize: 17},
  inputView: {paddingVertical: 10},
  containerStyle: {
    paddingVertical: 10,
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: colors.white4,
    borderRadius: 5,
    padding: 5,
    // marginVertical: 5,
  },
  inputStyle: {
    fontSize: 17,
    paddingHorizontal: 5,
  },
  titleStyle: {color: colors.black, fontSize: 17},
  buttonStyle: {
    backgroundColor: colors.primary,
    padding: 5,
    height: 50,
    borderRadius: 5,
  },
  buttonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  forgotView: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: __DEV__ ? 'ankitbhatt511@gmail.com' : '',
      password: __DEV__ ? '123456' : '',
      fullname: __DEV__ ? 'Ankit Bhatt' : '',

      // email: __DEV__ ? 'imobiledevzsolutions@gmail.com' : '',
      // password: __DEV__ ? '123456' : '',
      // fullname: 'imobiledevz',
      loading: false,
    };
  }

  setLoading = (loading) => {
    this.setState({loading});
  };

  signIn = () => {
    console.log('signIn');
    const {navigation} = this.props;
    navigation.navigate('Login');
  };

  openTerms = () => {
    const {navigation} = this.props;
    const termsURL =
      'https://firebasestorage.googleapis.com/v0/b/saan-app.appspot.com/o/pdf%2FSAAN%20APP%20-%20terms%20%26%20conditions.pdf?alt=media&token=f544af50-17f4-4ba4-b3fa-d66e09c5e3df';
    // navigation.navigate('WebViewPage', {
    //   url: termsURL,
    // });
    this.openUrl(termsURL);
  };

  openPrivacy = () => {
    const {navigation} = this.props;
    const privacyURL =
      'https://firebasestorage.googleapis.com/v0/b/saan-app.appspot.com/o/pdf%2FSAAN%20APP%20-%20Privacy%20Policy.pdf?alt=media&token=734f41bb-b3eb-4b8d-9099-ba3094f44a79';
    // navigation.navigate('WebViewPage', {
    //   url: privacyURL,
    // });
    this.openUrl(privacyURL);
  };

  openUrl = async (url) => {
    try {
      const canOpenUrl = await Linking.canOpenURL(url);
      if (canOpenUrl) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', "Can't open link");
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', "Can't open link");
    }
  };

  validate = () => {
    const {email: stateEmail, password, fullname, checked} = this.state;

    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (fullname.trim() === '' || fullname.length < 3) {
      Alert.alert(
        'Warning',
        'Please enter full name, must have 3 or more characters characters',
      );
      return false;
    }

    if (reg.test(stateEmail) == false) {
      Alert.alert('Warning', 'Invalid Email Address');
      return false;
    }

    if (password.trim() === '' || password.length < 6) {
      Alert.alert('Warning', 'password must be 6 or more charecters');
      return false;
    }

    if (!checked) {
      Alert.alert(
        'Warning',
        'You must ageree to Terms & Conditions and Privacy Policy',
      );
      return false;
    }

    this.createAccount();
  };

  createAccount = async () => {
    const {email, password, fullname} = this.state;
    const {dispatch} = this.props;
    try {
      const params = {
        date: 1,
        month: 1,
        year: 2020,
        phone: '',
        email,
        fullname,
        password,
        savePassword: true,
      };
      const tmpString = email.split('@');
      const username = tmpString[0];
      this.setLoading(true);
      await dispatch(
        RegisterRequest({
          ...params,
          username,
        }),
      );
      this.setLoading(false);
      // this.props.dispatch(createUser(email, password, fullname));
      // this.props.;
    } catch (error) {
      console.log(error);
      this.setState({loading: false}, () => {
        Alert.alert('Error', "Can't create new account.");
      });
    }
  };

  render() {
    const {navigation} = this.props;
    const {email, password, fullname, loading, checked} = this.state;
    return (
      <View style={styles.container}>
        <Image source={images.loginLogo} style={styles.absImage} />
        <Header
          barStyle="light-content"
          statusBarProps={{
            backgroundColor: colors.red,
          }}
          leftComponent={
            <Icon
              name="chevron-left"
              color="#fff"
              size={40}
              onPress={() => navigation.goBack()}
            />
          }
          backgroundColor="#0000"
          containerStyle={styles.headerCont}
        />
        <KeyboardAwareScrollView
          style={styles.flex}
          keyboardShouldPersistTaps="handled"
          extraHeight={250}
          contentContainerStyle={styles.flexGrow}>
          <View style={styles.logoView}>
            <View style={[styles.logoBackground, styles.shadow]}>
              <Image source={images.africaLogo} style={styles.logoImage} />
            </View>
            <Text style={styles.appTitle}>SAAN</Text>
          </View>
          <View style={[styles.cardView, styles.shadow]}>
            <View style={styles.topTextView}>
              <Text style={styles.bigText}>Welcome</Text>
              <Text style={styles.normalText}>Create your account</Text>
            </View>

            <View style={styles.inputView}>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Full Name"
                label=""
                placeholderTextColor={colors.silver}
                value={fullname}
                renderErrorMessage={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                containerStyle={styles.containerStyle}
                onChangeText={(val) => this.setState({fullname: val})}
              />

              <Input
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="E-mail"
                label=""
                placeholderTextColor={colors.silver}
                value={email}
                renderErrorMessage={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                containerStyle={styles.containerStyle}
                onChangeText={(val) => this.setState({email: val})}
              />

              <Input
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Password"
                placeholderTextColor={colors.silver}
                label=""
                value={password}
                renderErrorMessage={false}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                containerStyle={styles.containerStyle}
                secureTextEntry={true}
                onChangeText={(val) => this.setState({password: val})}
              />

              <CheckBox
                title={
                  <Text style={{fontSize: 12, color: colors.black}}>
                    I ageree to{' '}
                    <Text onPress={this.openTerms} style={{color: colors.pink}}>
                      Terms & Conditions
                    </Text>{' '}
                    and{' '}
                    <Text
                      onPress={this.openPrivacy}
                      style={{color: colors.pink}}>
                      Privacy Policy
                    </Text>
                  </Text>
                }
                checked={checked}
                Component={TouchableOpacity}
                activeOpacity={0.9}
                checkedColor={colors.primary}
                containerStyle={{backgroundColor: '#0000', borderWidth: 0}}
                onPress={() => {
                  this.setState({checked: !checked});
                }}
              />

              <Button
                title={'Sign Up'}
                onPress={this.validate}
                disabled={loading || !checked}
                loading={loading}
                titleStyle={styles.titleStyle}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainer}
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
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

Signup.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

Signup.defaultProps = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  // loginUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
