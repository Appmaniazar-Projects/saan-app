import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, Alert} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';
import images from '../config/images';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, Header, Icon, Input} from 'react-native-elements';
// import {loginUser} from '../redux/reducers/auth/actions';
import {LoginRequest} from '../redux/reducers/user/actions';

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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // email: __DEV__ ? 'ankitbhatt511@gmail.com' : '',
      // password: __DEV__ ? '123456' : '',
      email: __DEV__ ? 'ishitapurohit1@gmail.com' : '',
      password: __DEV__ ? '123456' : '',
      loading: false,
    };
  }

  signUp = () => {
    console.log('signUp');
    const {navigation} = this.props;
    navigation.navigate('Signup');
  };

  validate = () => {
    console.log('validate');
    const {email, password} = this.state;

    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(email) == false) {
      Alert.alert('Warning', 'Invalid Email Address');
      return false;
    }

    if (password.trim() === '' || password.length < 6) {
      Alert.alert('Warning', 'password must be 6 charecters');
      return false;
    }

    this.loginUser();
  };

  // goHome = () => {
  //   const {navigation} = this.props;
  //   navigation.navigate('DrawerStack');
  // };

  loginUser = async () => {
    const {email, password} = this.state;
    const {dispatch} = this.props;
    try {
      console.log('loginUser');
      this.setState({loading: true});
      // this.props.loginUser(email, password);
      const loginData = {
        email: email,
        password,
      };
      await dispatch(LoginRequest(loginData));
      this.setState({loading: false});
    } catch (error) {
      console.log(error);
      this.setState({loading: false}, () => {
        Alert.alert('Error', 'login failed');
      });
    }
  };

  render() {
    const {navigation} = this.props;
    const {email, password, loading} = this.state;
    return (
      <View style={styles.container}>
        {/* <StatusBar barStyle="light-content" backgroundColor={colors.primary} /> */}
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
              <Text style={styles.bigText}>Welcome back</Text>
              <Text style={styles.normalText}>Login to your account</Text>
            </View>

            <View style={styles.inputView}>
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
                renderErrorMessage={false}
                value={password}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                secureTextEntry={true}
                containerStyle={styles.containerStyle}
                onChangeText={(val) => this.setState({password: val})}
              />

              <Button
                title={'Sign In'}
                onPress={this.validate}
                disabled={loading}
                loading={loading}
                titleStyle={styles.titleStyle}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainer}
              />
            </View>

            <View style={styles.forgotView}>
              <Text style={styles.normalText}>Forgot your password?</Text>
            </View>
          </View>

          <View style={styles.w100}>
            <View style={styles.loginTextView}>
              <Text style={styles.loginText}>
                Don't have an account?{' '}
                <Text onPress={this.signUp} style={styles.loginLink}>
                  Sign up
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

Login.defaultProps = {};

const mapStateToProps = (state) => ({
  // auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  // loginUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
