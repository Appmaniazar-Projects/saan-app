import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  // SafeAreaView,
  // TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';
import parseMobile from 'libphonenumber-js/mobile';
import {Button, Header, Icon, Input} from 'react-native-elements';
import CountryPicker from 'react-native-country-picker-modal';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: colors.white,
  },
  headerCont: {
    borderBottomWidth: 0,
    backgroundColor: '#0000',
  },
  titleStyle: {color: colors.black, fontSize: 17},
  buttonStyle: {
    backgroundColor: colors.primary,
    // padding: 5,
    height: 50,
    borderRadius: 5,
  },
  buttonContainer: {
    // paddingHorizontal: 10,
  },
  mobileInputView: {
    width: '100%',
    height: 50,
    backgroundColor: '#F1F2F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  flex: {
    flex: 1,
  },
  containerStyle: {
    // backgroundColor: '#F004',
    paddingHorizontal: 10,
  },
  inputContainerStyle: {
    padding: 0,
    borderBottomWidth: 0,
    // backgroundColor: '#F006'
  },
  socialView: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    color: colors.silver,
    fontSize: 17,
  },
});

const INDIA = {
  callingCode: ['91'],
  cca2: 'IN',
  currency: ['INR'],
  flag: 'flag-in',
  name: 'India',
  region: 'Asia',
  subregion: 'Southern Asia',
};

const SOUTHAFRICA = {
  callingCode: ['27'],
  cca2: 'ZA',
  currency: ['ZAR'],
  flag: 'flag-za',
  name: 'South Africa',
  region: 'Africa',
  subregion: 'Southern Africa',
};

class Verify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countryCode: __DEV__ ? 'IN' : 'ZA',
      country: __DEV__ ? INDIA : SOUTHAFRICA,
      mobile: __DEV__ ? '9574952267' : '',
      loading: false,
    };
  }

  onSelect = (country) => {
    console.log(country);
    this.setState({
      countryCode: country.cca2,
      country,
    });
  };

  socialLogin = () => {
    console.log('socialLogin');
    const {navigation} = this.props;
    navigation.navigate('Welcome');
  };

  validate = () => {
    const {mobile, country} = this.state;
    // var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!country || !country.callingCode) {
      Alert.alert('Warning', 'password must be 6 charecters');
      return;
    }

    if (mobile.trim() === '' || mobile.length < 6) {
      Alert.alert('Warning', 'Please enter mobile number');
      return;
    }
    const phone = parseMobile(`+${country.callingCode}${mobile}`);

    if (!phone || !phone.isValid()) {
      Alert.alert('Warning', 'Please enter valid mobile number');
      return;
    }

    this.loginMobile();
  };

  loginMobile = async () => {
    const {mobile, country} = this.state;
    const {navigation} = this.props;
    const userData = {
      phone: mobile,
      countryCode: country.callingCode,
    };
    try {
      this.setState({loading: true});

      // var applicationVerifier = new auth.RecaptchaVerifier(
      //   'recaptcha-container',
      // );
      const confirmResult = await auth().signInWithPhoneNumber(
        `+${userData.countryCode}${userData.phone}`,
        // applicationVerifier,
      );
      console.log(confirmResult);
      this.setState({loading: false});
      navigation.navigate('PhoneVerification', {
        confirmResult,
        userData,
      });
    } catch (error) {
      console.log(error);
      this.setState({loading: false}, () => {
        Alert.alert('Warning', "Cant't verify mobile. please try again later!");
      });
    }
  };

  render() {
    const {navigation} = this.props;
    const {countryCode, country, mobile, loading} = this.state;
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
          <View style={{flex: 1}}>
            <Text style={{fontSize: 34, color: '#0A1F44', marginBottom: 20}}>
              {'Verify your\nphone number'}
            </Text>
            <Text style={{fontSize: 17, color: '#0A1F44'}}>
              We will sent OTP on following number to verify
            </Text>
          </View>
          <View style={{flex: 1}}>
            <View style={styles.mobileInputView}>
              <CountryPicker
                ref={(o) => {
                  this.CountryPicker = o;
                }}
                withCallingCodeButton
                countryCode={countryCode}
                onSelect={this.onSelect}
              />
              <Icon
                style={styles.searchIcon}
                name="md-caret-down-outline"
                type="ionicon"
                size={15}
                color="#000000"
                containerStyle={{width: 30}}
              />
              <View style={{flex: 1}}>
                <Input
                  value={mobile}
                  renderErrorMessage={false}
                  keyboardType="phone-pad"
                  onChangeText={(val) => this.setState({mobile: val})}
                  containerStyle={styles.containerStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                />
              </View>
            </View>

            <View style={styles.socialView}>
              <Text style={styles.socialText}>
                Or login with{' '}
                <Text onPress={this.socialLogin} style={{color: colors.red}}>
                  Social network
                </Text>
              </Text>
            </View>
          </View>

          <View>
            <Button
              title={'Next'}
              onPress={this.validate}
              loading={loading}
              disabled={loading}
              titleStyle={styles.titleStyle}
              buttonStyle={styles.buttonStyle}
              containerStyle={styles.buttonContainer}
            />
          </View>
          {/* <View style={{flex: 1.5}} /> */}
          {Platform.OS === 'ios' ? <KeyboardSpacer /> : null}
        </View>
      </View>
    );
  }
}

Verify.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

Verify.defaultProps = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  // loginUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
