import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {connect} from 'react-redux';
import moment from 'moment';
import colors from '../config/colors';
// import images from '../config/images';
import {Header, Icon, Button} from 'react-native-elements';
import {
  FetchExtraInfoRequest,
  LogoutRequest,
  setFcmToken,
  UpdateUserInfoRequest,
} from '../redux/reducers/user/actions';
import MaterialTabs from 'react-native-material-tabs';
// import {dispatch} from '../common/RootNavigation';

const {width, height} = Dimensions.get('window');
const numColumns = 3;
const PADDING = 7;
const cW = (width - PADDING * 2 * numColumns) / numColumns;
const cH = cW;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerCont: {
    borderBottomWidth: 0,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F3F6',
  },
  flexGrow: {
    flexGrow: 1,
  },
  card: {
    padding: PADDING,
    // backgroundColor: '#f004',
  },
  cardImage: {
    height: cH,
    width: cW,
    // backgroundColor: colors.primary,
    borderRadius: 10,
    // borderColor: '#000',
    // borderWidth: 1,
  },
  tabScreenView: {
    flex: 1,
    padding: PADDING,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  boldText: {fontSize: 17, fontWeight: 'bold'},
  normalText: {fontSize: 17, marginBottom: 10},
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 2,
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
    this.load();
  };

  // eslint-disable-next-line no-unused-vars
  onWillBlur = (payload) => {};

  setLoading = (bool) => {
    this.setState({loading: bool});
  };

  load = async () => {
    const {dispatch} = this.props;
    console.log('load');
    this.setLoading(true);
    // await dispatch(FetchStoryListRequest());
    await dispatch(FetchExtraInfoRequest());
    this.setLoading(false);
  };

  logout = async () => {
    const {dispatch} = this.props;
    try {
      await this.deleteToken();
      await dispatch(LogoutRequest());
    } catch (error) {
      console.log('logout error', error);
    }
  };

  deleteToken = async () => {
    const {user, dispatch} = this.props;
    const userInfo = user?.user?.userInfo;
    const token = user?.fcmToken;
    if (userInfo && token) {
      let notificationTokens = userInfo.notificationTokens;
      if (!_.isArray(notificationTokens)) {
        notificationTokens = [];
      }
      const indexToken = notificationTokens.indexOf(token);
      if (indexToken > -1) {
        // notificationTokens.push(token);
        console.log('token removed from array');
        notificationTokens.splice(indexToken, 1);
      }
      dispatch(setFcmToken(''));
      await dispatch(
        UpdateUserInfoRequest({
          notificationTokens,
        }),
      );
    }
  };

  setSelectedTab = (index) => {
    this.setState({selectedTab: index});
  };

  editProfile = () => {
    const {navigation} = this.props;
    navigation.navigate('EditProfile');
  };

  getBirthday = (userInfo) => {
    const birthday = userInfo?.birthday || '';
    if (birthday !== '') {
      const bM = moment(
        `${userInfo?.birthday.date}-${userInfo?.birthday.month}-${userInfo?.birthday.year}`,
        'DD-MM-YYYY',
      );
      return bM.format('DD MMM[,] YYYY');
    }
    return '';
  };

  renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.emptyContainerText}>Loading...</Text>
      </View>
    );
  };

  render() {
    const {selectedTab, loading} = this.state;
    const {user} = this.props;
    const userInfo = user?.user?.userInfo;
    // console.log('user', userInfo);
    return (
      <View style={styles.container}>
        <Header
          // leftComponent={
          //   <Icon name="chevron-left" color={colors.black} size={30} />
          // }
          backgroundColor={colors.white}
          centerComponent={{
            style: {color: colors.black, fontSize: 15},
          }}
          rightComponent={
            <Icon
              name="dots-three-vertical"
              type="entypo"
              color={colors.black}
              size={15}
              onPress={this.editProfile}
            />
          }
          containerStyle={styles.headerCont}
        />
        {loading ? (
          this.renderLoading()
        ) : (
          <View style={{flex: 1}}>
            <View style={{width: '100%', alignItems: 'center'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.editProfile}
                style={{
                  height: 120,
                  width: 120,
                  borderWidth: 2,
                  borderRadius: 60,
                  borderColor: colors.primary,
                  overflow: 'hidden',
                  marginVertical: 5,
                }}>
                <Image
                  source={{uri: userInfo?.avatarURL}}
                  style={{height: 120, width: 120, borderRadius: 60}}
                />
              </TouchableOpacity>

              <Text style={{fontSize: 20}}>
                {userInfo?.fullname || userInfo?.username || ''}
              </Text>
              {/* <Text
              style={{
                fontSize: 14,
                textDecorationStyle: 'solid',
                textDecorationLine: 'underline',
                fontWeight: 'bold',
              }}>
              SAAN Alumnus | Lives in Cape Town, South Africa
            </Text> */}
              <Text
                style={{
                  marginHorizontal: 20,
                  marginVertical: 15,
                }}>
                {userInfo?.bio || ''}
              </Text>
            </View>

            <Button
              title="Log out"
              onPress={this.logout}
              activeOpacity={0.8}
              type="outline"
              buttonStyle={{
                borderColor: colors.primary,
                width: 100,
                alignSelf: 'center',
              }}
              titleStyle={{
                fontSize: 14,
                color: colors.primary,
                textAlign: 'center',
              }}
            />
            {/* <Text
            style={{}}
            >
            Log out
          </Text> */}
            <MaterialTabs
              items={['About', 'Skills', 'Photos']}
              selectedIndex={selectedTab}
              onChange={this.setSelectedTab}
              barColor={colors.white}
              textStyle={{
                textTransform: 'capitalize',
                fontWeight: 'normal',
                fontSize: 17,
              }}
              indicatorColor="#0000"
              activeTextColor="#000"
              inactiveTextColor={colors.silver}
            />

            {selectedTab === 0 ? (
              <View style={styles.tabScreenView}>
                {/* <Text style={{fontSize: 17}}>About</Text> */}
                <Text style={styles.normalText}>{`Bio: ${userInfo?.bio}`}</Text>
                <Text style={styles.normalText}>
                  {`Birthday: ${this.getBirthday(userInfo)}`}
                </Text>
                <Text style={styles.normalText}>{`Gender: ${
                  userInfo?.gender === 1
                    ? 'Male'
                    : userInfo?.gender === 2
                    ? 'Female'
                    : ''
                }`}</Text>
                <Text style={styles.normalText}>{`Account Type: ${
                  userInfo?.accountType === 1
                    ? 'Individual'
                    : userInfo?.accountType === 2
                    ? 'Organization'
                    : ''
                }`}</Text>
              </View>
            ) : null}

            {selectedTab === 1 ? (
              <View style={styles.tabScreenView}>
                <Text style={styles.boldText}>Skills</Text>
                <Text style={{fontSize: 17}}>{userInfo?.skills}</Text>
              </View>
            ) : null}

            {selectedTab === 2 ? (
              <FlatList
                data={user?.photos || []}
                numColumns={numColumns}
                style={{flex: 1}}
                contentContainerStyle={{flexGrow: 1}}
                renderItem={({item}) => {
                  // let photo = null;
                  if (item.source) {
                    return item.source.map((ele, index) => {
                      if (index > 0) {
                        return null;
                      }
                      // console.log(ele, index);
                      return (
                        <View style={styles.card}>
                          <Image
                            source={{uri: ele.uri}}
                            style={styles.cardImage}
                          />
                        </View>
                      );
                    });
                  }
                  return null;
                }}
              />
            ) : null}
          </View>
        )}
      </View>
    );
  }
}

MyProfile.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

MyProfile.defaultProps = {};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
