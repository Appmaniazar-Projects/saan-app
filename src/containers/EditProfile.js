import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';
import {Dropdown} from '../libs/react-native-material-dropdown';
import {Header, Icon, Input} from 'react-native-elements';
import {DEFAULT_PHOTO_URI} from '../constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import parseMobile from 'libphonenumber-js/mobile';
import {
  UpdateUserInfoRequest,
  UploadAvatarRequest,
} from '../redux/reducers/user/actions';
import {navigation} from '../common/RootNavigation';
import {generateUsernameKeywords} from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerCont: {
    borderBottomWidth: 0,
    backgroundColor: '#F7F8FA',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  flexGrow: {
    flexGrow: 1,
  },
});

const accountTypeData = [
  {value: 1, label: 'Individual'},
  {value: 2, label: 'Organization'},
];

const genderData = [
  {value: 1, label: 'Male'},
  {value: 2, label: 'Female'},
];

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarURL: DEFAULT_PHOTO_URI,
      fullname: '',
      email: '',
      phone: '',
      bio: '',
      gender: 0,
      birthday: {
        date: 1,
        month: 1,
        year: 2007,
      },
      accountType: 1,
      skills: '',
      tempImage: null,
      isDatePickerVisible: false,
      loading: false,
    };
  }

  componentDidMount() {
    this.addNavigationEvents();
  }

  componentWillUnmount() {
    this.removeNavigationEvents();
  }

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
    // this.props.dispatch(TriggerMessageListenerRequest());
    const {user} = this.props;
    const userInfo = user?.user?.userInfo;
    this.setState({
      avatarURL: userInfo?.avatarURL || DEFAULT_PHOTO_URI,
      fullname: userInfo?.fullname || '',
      email: userInfo?.email || '',
      phone: userInfo?.phone || '',
      bio: userInfo?.bio || '',
      gender: userInfo?.gender || 0,
      birthday: {
        date: userInfo?.birthday?.date || 1,
        month: userInfo?.birthday?.month || 1,
        year: userInfo?.birthday?.year || 2020,
      },
      accountType: userInfo?.accountType || 1,
      skills: userInfo?.skills || '',
      tempImage: null,
      isDatePickerVisible: false,
    });
  };

  // eslint-disable-next-line no-unused-vars
  onWillBlur = (payload) => {};

  showDatePicker = () => {
    this.setState({isDatePickerVisible: true});
  };

  handleConfirm = (date) => {
    console.log(date);
    const bD = moment(date);
    this.setState({
      birthday: {
        date: bD.date(),
        month: bD.month() + 1,
        year: bD.year(),
      },
      isDatePickerVisible: false,
    });
  };

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
  };

  validate = () => {
    const {
      avatarURL,
      fullname,
      email,
      phone,
      bio,
      gender,
      birthday,
      accountType,
    } = this.state;

    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (fullname.trim() === '' || fullname.length < 3) {
      Alert.alert(
        'Warning',
        'Please enter full name, must have 3 or more characters characters',
      );
      return false;
    }

    if (reg.test(email) == false) {
      Alert.alert('Warning', 'Invalid Email Address');
      return false;
    }

    if (phone.trim() === '' || phone.length < 6) {
      Alert.alert('Warning', 'Please enter mobile number');
      return;
    }
    const phoneN = parseMobile(phone);

    if (!phoneN || !phoneN.isValid()) {
      Alert.alert('Warning', 'Please enter valid mobile number');
      return;
    }

    if ([1, 2].indexOf(gender) < 0) {
      Alert.alert('Warning', 'Please select gender');
      return;
    }

    if (!birthday) {
      Alert.alert('Warning', 'Please select birth date');
      return;
    }

    const bM = moment(
      `${birthday.date}-${birthday.month}-${birthday.year}`,
      'DD-MM-YYYY',
    );

    if (!bM || !bM.isValid()) {
      Alert.alert('Warning', 'Please select valid birth date');
      return;
    }

    if ([1, 2].indexOf(accountType) < 0) {
      Alert.alert('Warning', 'Please select Account Type');
      return;
    }

    // if (avatarURL.trim() === '' || avatarURL.length < 6) {
    //   Alert.alert('Warning', 'password must be 6 or more charecters');
    //   return false;
    // }
    this.updateProfile();
  };

  removeImage = async () => {
    const {dispatch} = this.props;
    await dispatch(
      UpdateUserInfoRequest({
        avatarURL: DEFAULT_PHOTO_URI,
      }),
    );
  };

  updatePicture = async () => {
    try {
      const {tempImage} = this.state;
      const {dispatch} = this.props;
      const {path: uri, filename} = tempImage;
      const extension = uri.split('.').pop()?.toLocaleLowerCase();
      this.setState({uploading: true});
      await dispatch(UploadAvatarRequest(uri, String(extension)));
      this.setState({uploading: false, tempImage: null});
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  updateProfile = async () => {
    const {dispatch} = this.props;
    const {
      fullname,
      email,
      phone,
      bio,
      gender,
      birthday,
      tempImage,
      accountType,
      skills,
    } = this.state;
    try {
      this.setState({loading: true});
      let keywords = [];
      const {user} = this.props;
      const userInfo = user?.user?.userInfo;
      keywords = keywords.concat(
        generateUsernameKeywords(userInfo.username || ''),
      );
      keywords = keywords.concat(generateUsernameKeywords(fullname || ''));
      await dispatch(
        UpdateUserInfoRequest({
          fullname,
          email,
          phone,
          bio,
          gender,
          birthday,
          keyword: keywords,
          accountType,
          skills,
        }),
      );
      let success = true;
      if (tempImage) {
        success = await this.updatePicture();
      }
      this.setState({loading: false});
      if (success) {
        this.props.navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      this.setState({loading: false}, () => {
        Alert.alert(
          'Error',
          error && error.message
            ? error.message
            : 'Error in updating profile, please try later!',
        );
      });
    }
  };

  handleActionSheet = async (index) => {
    if (index === 0) {
      try {
        const image = await ImagePicker.openCamera({
          width: 400,
          height: 400,
          cropping: true,
        });
        console.log(image);
        this.setState({tempImage: image});
      } catch (error) {
        console.log(error);
        Alert.alert(
          'Error',
          error && error.message ? error.message : 'Unknown Error',
        );
      }
    }
    if (index === 1) {
      try {
        const image = await ImagePicker.openPicker({
          width: 400,
          height: 400,
          cropping: true,
        });
        console.log(image);
        this.setState({tempImage: image});
      } catch (error) {
        console.log(error);
        Alert.alert(
          'Error',
          error && error.message ? error.message : 'Unknown Error',
        );
      }
    }

    if (index === 2) {
      this.removeImage();
    }
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  render() {
    const {
      avatarURL,
      fullname,
      email,
      phone,
      bio,
      gender,
      birthday,
      tempImage,
      loading,
      accountType,
      skills,
    } = this.state;
    return (
      <View style={styles.container}>
        <Header
          statusBarProps={{
            backgroundColor: '#F7F8FA',
            barStyle: 'dark-content',
          }}
          leftComponent={
            <Icon
              name="chevron-left"
              color={colors.black}
              size={30}
              onPress={navigation.goBack}
            />
          }
          backgroundColor={colors.white}
          centerComponent={{
            text: 'Edit Profile',
            style: {color: colors.black, fontSize: 15},
          }}
          rightComponent={
            loading ? (
              <ActivityIndicator color={colors.red} size="small" />
            ) : (
              <Text
                onPress={this.validate}
                style={{color: colors.red, fontSize: 15}}>
                Save
              </Text>
            )
          }
          containerStyle={styles.headerCont}
        />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.scrollView}
          contentContainerStyle={styles.flexGrow}>
          <View
            style={{
              paddingVertical: 20,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={this.showActionSheet}
              style={{
                padding: 5,
                borderRadius: 10,
                borderColor: colors.primary,
                borderWidth: 2,
              }}>
              <Image
                source={{uri: tempImage?.path || avatarURL}}
                style={{
                  height: 180,
                  width: 150,
                  borderRadius: 10,
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: colors.white,
              width: '100%',
              paddingHorizontal: 15,
              paddingVertical: 25,
            }}>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              value={fullname}
              label="Full Name"
              placeholder="Enter Full Name"
              onChangeText={(val) => {
                this.setState({fullname: val});
              }}
            />
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              label="Email"
              placeholder="Email"
              onChangeText={(val) => {
                this.setState({email: val});
              }}
            />
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              value={phone}
              label="Mobile"
              placeholder="Enter Mobile number (i.e. +27 1234567890)"
              onChangeText={(val) => {
                this.setState({phone: val});
              }}
            />
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              label="Bio"
              placeholder="Enter Bio"
              value={bio}
              onChangeText={(val) => {
                this.setState({bio: val});
              }}
            />

            <Dropdown
              label="Select Gender"
              value={gender}
              valueExtractor={(item) => item.value}
              containerStyle={{paddingHorizontal: 5}}
              inputContainerStyle={{borderBottomWidth: 1, marginBottom: 20}}
              labelFontSize={17}
              labelTextStyle={{fontWeight: 'bold'}}
              data={genderData}
              onChangeText={(val) => {
                this.setState({gender: val});
              }}
              dropdownPosition={0}
            />

            <TouchableOpacity activeOpacity={0.9} onPress={this.showDatePicker}>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                label="Birthday"
                disabled
                pointerEvents="none"
                value={`${birthday.date}-${birthday.month}-${birthday.year}`}
              />
            </TouchableOpacity>

            <Dropdown
              label="Select Account Type"
              value={accountType}
              valueExtractor={(item) => item.value}
              containerStyle={{paddingHorizontal: 5}}
              inputContainerStyle={{borderBottomWidth: 1, marginBottom: 20}}
              labelFontSize={17}
              labelTextStyle={{fontWeight: 'bold'}}
              data={accountTypeData}
              onChangeText={(val) => {
                this.setState({accountType: val});
              }}
              dropdownPosition={0}
            />

            <Input
              autoCapitalize="none"
              autoCorrect={false}
              label="Skills"
              placeholder="Enter your skills separated by comma"
              value={skills}
              onChangeText={(val) => {
                this.setState({skills: val});
              }}
            />

            <DateTimePickerModal
              isVisible={this.state.isDatePickerVisible}
              mode="date"
              minimumDate={moment('1-1-1980', 'DD-MM-YYYY').toDate()}
              maximumDate={moment()
                .startOf('day')
                .subtract('10', 'years')
                .toDate()}
              onConfirm={this.handleConfirm}
              onCancel={this.hideDatePicker}
            />
          </View>
        </KeyboardAwareScrollView>
        <ActionSheet
          ref={(o) => {
            this.ActionSheet = o;
          }}
          title={'Select option'}
          options={['Camera', 'Gallery', 'Remove Photo', 'Cancel']}
          cancelButtonIndex={3}
          destructiveButtonIndex={3}
          onPress={this.handleActionSheet}
        />
      </View>
    );
  }
}

EditProfile.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

EditProfile.defaultProps = {};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
