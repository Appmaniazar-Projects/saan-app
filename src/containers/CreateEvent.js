import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  // ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import {connect} from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import colors from '../config/colors';
import {Button, Header, Icon, Input} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Alert} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import DateTimePicker from '@react-native-community/datetimepicker';
import {CreateEventRequest} from '../redux/reducers/event/actions';

const {height, width} = Dimensions.get('window');

const padding = 15;
const numColumns = Math.floor((width - padding * 2) / 90);
console.log('numColumns', numColumns);
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  headerCont: {
    borderBottomWidth: 0,
  },
  imageScroll: {flexGrow: 1, paddingVertical: 15},
  scrollView: {
    flexGrow: 1,
    padding: padding,
  },
  flex: {
    flex: 1,
  },
  mainView: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgray,
    // padding: 15,
    // paddingVertical: padding,
  },
  name: {
    fontSize: 13,
    color: colors.silver,
    // fontFamily: fonts.semibold,
  },
  iconView: {
    flexDirection: 'row',
    padding: 5,
  },
  subText: {
    fontSize: 15,
    color: colors.black1,
    // fontFamily: fonts.Regular,
  },
  eventButton: {
    backgroundColor: colors.yellow,
    height: 50,
    // width: '90%',
    borderRadius: 6,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // marginBottom: 20,
  },
  btnCont: {
    padding: padding,
  },
  eventText: {
    color: colors.white,
    fontSize: 15,
  },
  imagesView: {
    paddingLeft: padding - 5,
  },
  imageText: {
    color: colors.black,
    fontSize: 12,
    // fontFamily: fonts.semibold,
  },
  cameraViewMain: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    paddingVertical: 15,
    // right: 20,
  },
  cameraView: {
    backgroundColor: colors.lightgray,
    height: 70,
    width: 70,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  blankImage: {
    backgroundColor: colors.lightgray,
    height: 70,
    width: 70,
    borderRadius: 6,
    margin: 10,
    overflow: 'hidden',
    // marginRight: 20,
  },
  camera: {
    fontSize: 25,
    color: colors.gray1,
    // marginTop: 20,
  },
  absView: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absLoader: {
    height: 150,
    width: 150,
    backgroundColor: '#0008',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 1,
          label: 'TITLE',
          placeholder: 'Enter Event Title',
          key: 'title',
          default: '',
          // name: 'TITLE',
          // subText: 'Continental Alumni Summit',
        },
        {
          id: 2,
          label: 'DESCRIPTION',
          placeholder: 'Enter Description',
          key: 'content',
          default: '',
          // name: 'DESCRIPTION ',
          // subText:
          //   'This summit seeks to encourage young people to engage stakeholders directly in order to improve the quality of exchange.',
        },
        {
          id: 3,
          icon: (
            <Icon
              name="map-pin"
              type="feather"
              color={'#FF2D55'}
              size={17}
              // top={2}
            />
          ),
          label: 'PLACE',
          placeholder: 'Enter Place of event',
          key: 'place',
          default: '',
          InputComponent: 'places',
        },
        {
          id: 4,
          icon: (
            <Icon
              name="clock"
              type="feather"
              color={'#FF2D55'}
              size={17}
              top={2}
            />
          ),
          label: 'DATE',
          placeholder: 'Enter Date of event',
          key: 'date',
          default: '',
          InputComponent: 'date',
          // name: 'DATE TIME',
          // subText: '  25 Nov, 2020 10:30 AM',
        },
        {
          id: 5,
          icon: (
            <Icon
              name="clock"
              type="feather"
              color={'#FF2D55'}
              size={17}
              top={2}
            />
          ),
          label: 'START TIME',
          placeholder: 'Enter time when event starts',
          key: 'start_time',
          default: '',
          InputComponent: 'time',
          // name: 'DATE TIME',
          // subText: '  25 Nov, 2020 10:30 AM',
        },
        {
          id: 5,
          icon: (
            <Icon
              name="clock"
              type="feather"
              color={'#FF2D55'}
              size={17}
              top={2}
            />
          ),
          label: 'END TIME',
          placeholder: 'Enter time when event ends',
          key: 'end_time',
          default: '',
          InputComponent: 'time',
          // name: 'DATE TIME',
          // subText: '  25 Nov, 2020 10:30 AM',
        },
      ],
      isDatePickerVisible: false,
      isTimePickerVisible: '',
      title: '',
      place: '',
      date: '',
      start_time: moment().toDate(),
      end_time: moment().add(2, 'hours').toDate(),
      content: '',
      tempImage: null,
      loading: false,
    };
  }

  renderItem = ({item}) => {
    return (
      <View style={styles.MainView}>
        <Text style={styles.Name}>{item.name}</Text>
        <View style={styles.IconView}>
          {item.icon}
          <Text style={styles.SubText}>{item.subText}</Text>
        </View>
      </View>
    );
  };

  validate = () => {
    const {tempImage, title, content, place, date, start_time, end_time} = this.state;

    // var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (!tempImage || !tempImage.path) {
      Alert.alert('Warning', 'Please add event image');
      return false;
    }

    if (title.trim() === '') {
      Alert.alert('Warning', 'Please enter event title');
      return false;
    }

    if (content.trim() === '') {
      Alert.alert('Warning', 'Please enter event description');
      return;
    }

    if (place.trim() === '') {
      Alert.alert('Warning', 'Please enter event place');
      return;
    }

    const bM = moment(date);

    if (!bM || !bM.isValid()) {
      Alert.alert('Warning', 'Please select valid event date');
      return;
    }

    const bS = moment(start_time);

    if (!bS || !bS.isValid()) {
      Alert.alert('Warning', 'Please select valid event start time');
      return;
    }

    const bE = moment(end_time);

    if (!bE || !bE.isValid()) {
      Alert.alert('Warning', 'Please select valid event end time');
      return;
    }

    this.createEvent();
  };

  createEvent = async () => {
    const {dispatch} = this.props;
    const {
      tempImage,
      title,
      content,
      place,
      date,
      start_time,
      end_time,
    } = this.state;

    try {
      this.setState({loading: true});
      await dispatch(
        CreateEventRequest({
          tempImage,
          title,
          content,
          place,
          date,
          start_time,
          end_time,
        }),
      );
      this.setState({loading: false}, this.goBack);
    } catch (error) {
      this.setState({loading: false});
    }
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  showDatePicker = () => {
    this.setState({isDatePickerVisible: true});
  };

  handleConfirm = (date) => {
    console.log(date);
    this.setState({isDatePickerVisible: false, date});
    // const bD = moment(date);
    // this.setState({
    //   birthday: {
    //     date: bD.date(),
    //     month: bD.month() + 1,
    //     year: bD.year(),
    //   },
    //   isDatePickerVisible: false,
    // });
  };

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
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

  removeImage = () => {
    this.setState({tempImage: null});
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  renderLoading = () => {
    return (
      <View style={styles.absView}>
        <View style={styles.absLoader}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      </View>
    );
  };

  onTimeChange = (event, val) => {
    const {isTimePickerVisible} = this.state;
    console.log('val', val);
    this.setState({[isTimePickerVisible]: val, isTimePickerVisible: ''});
  };

  render() {
    const {loading, isTimePickerVisible, isDatePickerVisible} = this.state;
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon
              name="chevron-left"
              color={colors.black}
              size={30}
              onPress={this.goBack}
            />
          }
          backgroundColor={colors.gray}
          centerComponent={{
            text: 'Create Event',
            style: {color: colors.black, fontSize: 15},
          }}
          containerStyle={styles.headerCont}
        />
        <KeyboardAwareScrollView
          style={styles.flex}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <View style={styles.imagesView}>
            <Text style={styles.imageText}>IMGAES</Text>
            <FlatList
              data={[this.state.tempImage || {add: 1}]}
              // horizontal
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.imageScroll}
              renderItem={({item}) => {
                console.log('item', item);
                if (!item || !item.path) {
                  return (
                    <TouchableOpacity
                      style={styles.cameraView}
                      onPress={this.showActionSheet}>
                      <Icon
                        name="camera"
                        type="foundation"
                        iconStyle={styles.camera}
                      />
                    </TouchableOpacity>
                  );
                }
                return (
                  <TouchableOpacity style={styles.blankImage}>
                    <Image source={{uri: item.path}} style={{flex: 1}} />
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {this.state.data.map((item) => {
            if (item.InputComponent === 'date') {
              const {date} = this.state;
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={this.showDatePicker}>
                  <Input
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder={item.placeholder}
                    label={item.label}
                    value={
                      date && date !== ''
                        ? moment(date).format('DD-MM-YYYY')
                        : ''
                    }
                    disabled
                    pointerEvents="none"
                  />
                </TouchableOpacity>
              );
            }

            if (item.InputComponent === 'time') {
              const {[item.key]: timeVal} = this.state;
              console.log('timeVal', timeVal);
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    this.setState({
                      isTimePickerVisible: item.key,
                    });
                  }}>
                  <Input
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder={item.placeholder}
                    label={item.label}
                    value={
                      timeVal && timeVal !== ''
                        ? moment(timeVal).format('HH:mm A')
                        : ''
                    }
                    disabled
                    pointerEvents="none"
                  />
                </TouchableOpacity>
              );
            }

            // if (item.InputComponent === 'places') {
            //   return (
            //     <GooglePlacesAutocomplete
            //       placeholder={item.placeholder}
            //       onPress={(data, details = null) => {
            //         // 'details' is provided when fetchDetails = true
            //         console.log(data, details);
            //       }}
            //       query={{
            //         key: 'AIzaSyDn7dUvvxqm6lm1U6Folt0jP6M7Mhcba8o',
            //         language: 'en',
            //       }}
            //       onFail={(e) => console.log('onFail', e)}
            //       onNotFound={(e) => console.log('onNotFound', e)}
            //       onTimeout={(e) => console.log('onTimeout', e)}
            //       listEmptyComponent={() => null}
            //     />
            //   );
            // }

            return (
              <Input
                placeholder={item.placeholder}
                label={item.label}
                autoCapitalize="none"
                autoCorrect={false}
                // textContentType=""
                defaultValue={item.default}
                value={this.state[item.key]}
                labelStyle={{fontWeight: 'normal', fontSize: 12}}
                inputContainerStyle={styles.mainView}
                onChangeText={(val) => {
                  this.setState({[item.key]: val});
                }}
                leftIcon={item.icon ? item.icon : undefined}
              />
            );
          })}
        </KeyboardAwareScrollView>

        <Button
          containerStyle={styles.btnCont}
          title="Create Event"
          titleStyle={styles.eventText}
          disabled={loading}
          loading={loading}
          onPress={this.validate}
          buttonStyle={styles.eventButton}
        />

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          minimumDate={moment().toDate()}
          maximumDate={moment().startOf('day').add(50, 'years').toDate()}
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
        />

        {isTimePickerVisible !== '' && (
          <DateTimePicker
            testID={`date_time_picker_${isTimePickerVisible}`}
            value={this.state[isTimePickerVisible]}
            mode={'time'}
            // is24Hour={true}
            style={{
              backgroundColor: colors.gray,
            }}
            display={Platform.OS === 'android' ? 'clock' : 'spinner'}
            onChange={this.onTimeChange}
          />
        )}

        <ActionSheet
          ref={(o) => {
            this.ActionSheet = o;
          }}
          title={'Select option'}
          options={['Camera', 'Gallery', 'Remove Image', 'Cancel']}
          cancelButtonIndex={3}
          destructiveButtonIndex={3}
          onPress={this.handleActionSheet}
        />

        {loading ? this.renderLoading() : null}
      </View>
    );
  }
}

CreateEvent.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

CreateEvent.defaultProps = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);
