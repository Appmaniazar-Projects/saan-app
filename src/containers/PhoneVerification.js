import React, {Component} from 'react';
import {View, Text, StyleSheet, Alert, Platform} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';
import {Button, Header, Icon} from 'react-native-elements';
import OTPInputView from 'react-native-otp-input';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {LoginWithMobile, MobileRequest} from '../redux/reducers/user/actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerCont: {
    borderBottomWidth: 0,
    backgroundColor: '#0000',
  },
  titleStyle: {
    color: colors.black,
    fontSize: 17,
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 5,
  },
  buttonContainer: {
    // paddingHorizontal: 10,
  },
  mobileInputView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  flex: {
    flex: 1,
  },
  containerStyle: {
    paddingHorizontal: 10,
  },
  inputContainerStyle: {
    padding: 0,
    borderBottomWidth: 0,
  },
  socialView: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    color: colors.silver,
    fontSize: 17,
    textAlign: 'center',
  },
  underlineStyleBase: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#F1F2F6',
    borderBottomWidth: 1,
    color: '#000',
    fontSize: 20,
    marginHorizontal: 3,
  },

  underlineStyleHighLighted: {
    borderColor: colors.red, // '#03DAC6',
    backgroundColor: colors.primary,
    color: '#fff',
  },
});

class PhoneVerification extends Component {
  constructor(props) {
    super(props);

    this.unsubscribe = null;
    this.state = {
      confirmResult: null,
      code: '',
      loading: false,
    };
  }

  componentDidMount() {
    this.addNavigationEvents();
    this.unsubscribe = auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  componentWillUnmount() {
    this.removeNavigationEvents();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  onAuthStateChanged = async (user) => {
    if (user) {
      console.log('main user', user);
      // this.setState({user: user.toJSON()});
    }
  };

  addNavigationEvents = () => {
    const {navigation} = this.props;
    this.didFocus = navigation.addListener('focus', this.onDidFocus);
    this.willBlur = navigation.addListener('blur', this.onWillBlur);
  };

  removeNavigationEvents = () => {
    if (this.didFocus) {
      this.didFocus();
    }
    if (this.willBlur) {
      this.willBlur();
    }
  };

  // eslint-disable-next-line no-unused-vars
  onDidFocus = (payload) => {
    const {route} = this.props;
    // console.log(route.params.confirmResult);
    if (route.params && route.params.confirmResult) {
      this.setState({
        confirmResult: route.params.confirmResult,
      });
    }
  };

  // eslint-disable-next-line no-unused-vars
  onWillBlur = (payload) => {};

  resendCode = async () => {
    const {route} = this.props;
    const {userData} = route.params;
    try {
      const confirmResult = await auth().signInWithPhoneNumber(
        `+${userData.countryCode}${userData.phone}`,
      );
      console.log(confirmResult);
      this.setState({confirmResult});
    } catch (error) {
      console.log(error);
      Alert.alert('Warning', "Cant't re-send. please try again later!");
    }
  };

  verifyUser = async () => {
    const {confirmResult, code} = this.state;
    const {dispatch, route} = this.props;
    const {userData} = route.params;
    try {
      this.setState({loading: true});
      const phone = `+${userData.countryCode}${userData.phone}`;
      const user = await confirmResult.confirm(code);
      console.log(user);
      this.setState({loading: false});
      const rq = await firestore()
        .collection('users')
        .where('phone', '==', phone)
        .get();
      // console.log(rq)
      if (rq.size > 0) {
        await dispatch(
          LoginWithMobile({
            // ...params,
            phone,
          }),
        );
      } else {
        const username = phone;
        const today = new Date();
        const params = {
          date: today.getDate(),
          month: today.getMonth(),
          year: today.getFullYear(),
          phone,
          email: '',
          fullname: '',
          password: '',
          savePassword: true,
        };
        await dispatch(
          MobileRequest({
            ...params,
            username,
          }),
        );
      }
      this.setState({loading: true});
    } catch (error) {
      console.log(error);
      this.setState({loading: false}, () => {
        Alert.alert('Warning', "Cant't verify number. please try again later!");
      });
    }
  };

  render() {
    const {navigation} = this.props;
    const {loading} = this.state;
    return (
      <View style={styles.container}>
        <Header
          barStyle="dark-content"
          statusBarProps={{
            backgroundColor: colors.white,
          }}
          leftComponent={
            <Icon
              name="chevron-left"
              color={colors.black}
              size={40}
              onPress={() => navigation.goBack()}
            />
          }
          backgroundColor="#0000"
          containerStyle={styles.headerCont}
        />

        <View style={{flex: 1, padding: 30}}>
          <View style={{height: 130}}>
            <Text style={{fontSize: 34, color: '#0A1F44', marginBottom: 20}}>
              {'Phone Verification'}
            </Text>
            <Text style={{fontSize: 17, color: '#0A1F44'}}>
              Enter your OTP code here
            </Text>
          </View>
          <View style={{flex: 1}}>
            <View style={styles.mobileInputView}>
              <OTPInputView
                style={{
                  // width: '80%',
                  height: 100,
                }}
                pinCount={6}
                autoFocusOnLoad
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={(code) => {
                  console.log(`Code is ${code}, you are good to go!`);
                  this.setState({code}, this.verifyUser);
                }}
              />
            </View>

            <View style={styles.socialView}>
              <Text style={styles.socialText}>
                Didn't you received any code?{'\n'}{' '}
                <Text onPress={this.resendCode} style={{color: colors.primary}}>
                  Resend a new code.
                </Text>
              </Text>
            </View>
          </View>

          <View>
            <Button
              title={'Verify'}
              onPress={this.verifyUser}
              loading={loading}
              disabled={loading}
              titleStyle={styles.titleStyle}
              buttonStyle={styles.buttonStyle}
              containerStyle={styles.buttonContainer}
            />
          </View>
          {/* <View style={{flex: 1.3}} /> */}
          {Platform.OS === 'ios' ? <KeyboardSpacer /> : null}
        </View>
      </View>
    );
  }
}

PhoneVerification.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

PhoneVerification.defaultProps = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  // loginUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(PhoneVerification);
