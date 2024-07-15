import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';
import images from '../config/images';
// import images from '../config/fonts';
import {Header} from 'react-native-elements';
import {FetchNotificationListRequest} from '../redux/reducers/notification/actions';
import {notificationTypes} from '../redux/reducers/notification/types';
import {timestampToString} from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerCont: {
    borderBottomWidth: 0,
    // backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  flexGrow: {
    flexGrow: 1,
  },

  View: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#F1F2F4',
  },
  Time: {color: colors.silver},
  UserName: {
    color: colors.black,
    // fontFamily: fonts.semibold,
    fontSize: 15,
  },
  NameView: {padding: 5, flexDirection: 'row', justifyContent: 'space-between'},
  HoursText: {
    color: colors.silver,
    fontSize: 15,
    // fontFamily: fonts.regular,
  },
  ImageStyle: {
    height: 50,
    width: 50,
    borderRadius: 30,
    backgroundColor: '#333A4D48',
  },
  MainView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  MainFollowView: {alignSelf: 'center'},
  TextStyleView: {paddingLeft: 20},
  TravelText: {color: '#FF2D55', fontSize: 12},
  TipsText: {color: '#000000', fontSize: 15},
  ImageCustomView: {flexDirection: 'row'},
  Image: {
    backgroundColor: '#ACB1C0',
    height: 180,
    width: 150,
    borderRadius: 5,
    marginLeft: 15,
    margin: 20,
  },
  ImageColumnView: {right: 20, flexDirection: 'column'},
  ImageRightView: {
    backgroundColor: '#ACB1C0',
    height: 80,
    width: 80,
    borderRadius: 5,
    marginLeft: 15,
    margin: 20,
  },
  SecondImage: {
    backgroundColor: '#ACB1C0',
    height: 80,
    width: 80,
    bottom: 20,
    borderRadius: 5,
    marginLeft: 15,
    margin: 20,
  },
  LeftImage: {right: 40, flexDirection: 'column'},
  LastImage: {
    backgroundColor: '#000000B3',
    height: 80,
    width: 80,
    bottom: 20,
    borderRadius: 5,
    marginLeft: 15,
    margin: 20,
  },
  ImageTextView: {paddingTop: 30},
  ImageText: {color: '#fff', fontSize: 17, textAlign: 'center'},
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainerText: {
    fontSize: 20,
    color: colors.silver,
  },
});

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      loading: false,
      data: [
        {
          id: 1,
          name: 'Manelisi Billy followed you',
          image: images.members1Logo,
          subText: '1 hours ago',
        },
        {
          id: 2,
          name: 'Mpho Matamela liked 3 your photos',
          image: images.MphoLogo,
          images: images.Image4Logo,
          image2: images.Image5Logo,
          image1: images.Image6Logo,
          subText: '1 hours ago',
        },
        {
          id: 3,
          name:
            'Walusungu Ngulube react for story “My 1st Project” to your timeline',
          image: images.WalusunguLogo,

          subText: '2 hours ago',
        },

        {
          id: 4,
          name: '@Lilly commented on photo',
          image: images.NolithaLogo,
          text: 'This is true beauty at its best!',
          images: images.Image4Logo,
          subText: '3 hours ago',
        },
        {
          id: 5,
          name: 'Walusungu Ngulube',
          image: images.membersLogo,
        },
      ],
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
    await dispatch(FetchNotificationListRequest());
    this.setLoading(false);
  };

  updateIndex = (selectedIndex) => {
    this.setState({selectedIndex});
  };

  renderItem = ({item}) => {
    const froms = [...(item.froms || [])];
    let content = '';
    switch (item.type) {
      case notificationTypes.LIKE_MY_COMMENT:
        content = 'liked your comment.';
        break;
      case notificationTypes.LIKE_MY_POST:
        content = 'liked your photo.';
        break;
      case notificationTypes.COMMENT_MY_POST:
        content = `commented: ${item.commentInfo?.content}`;
        break;
      case notificationTypes.FOLLOW_ME:
        content = 'started following you.';
        break;
      case notificationTypes.LIKE_MY_REPLY:
        content = 'like your comment.';
        break;
      case notificationTypes.REPLY_MY_COMMENT:
        content = `commented: ${item.replyInfo?.content}`;
        break;
      case notificationTypes.SOMEONE_POSTS:
        content = `${item.postInfo?.userId} posted new photo.`;
        break;
      case notificationTypes.SOMEONE_LIKE_SOMEONE_POST:
        content = 'liked your following post.';
        break;
      case notificationTypes.SOMEONE_COMMENT_SOMEONE_POST:
        content = `commented: ${item.commentInfo?.content}`;
        break;
    }
    return (
      <View style={styles.View}>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 30,
            borderColor: '#4A4A4A',
            height: 50,
          }}>
          {item.previewFroms && (
            <Image
              source={{uri: item.previewFroms[0].avatarURL}}
              style={styles.ImageStyle}
            />
          )}
        </View>
        <View style={{flex: 1, paddingLeft: 20}}>
          <Text style={styles.UserName}>{froms.splice(0, 2).join(', ')} </Text>
          {/* <Text style={styles.UserName}>{item.text}</Text> */}
          {froms.length > 0 && (
            <Text style={styles.UserName}>
              {' '}
              and {froms.length} {froms.length > 1 ? 'others' : 'other'}{' '}
            </Text>
          )}
          <Text>{content}</Text>
          {/* <View style={{flexDirection: 'row'}}>
            <Image
              source={item.images}
              style={{height: 50, width: 50, borderRadius: 6}}
            />
            <Image
              source={item.image1}
              style={{height: 50, width: 70, borderRadius: 9, left: 10}}
            />
            <Image
              source={item.image2}
              style={{height: 50, width: 70, borderRadius: 9, left: 15}}
            />
          </View> */}
          <Text style={styles.HoursText}>
            {timestampToString(item.create_at.toMillis())}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    const {notifications} = this.props;
    const {loading} = this.state;

    console.log('notifications', notifications);
    return (
      <View style={styles.container}>
        <Header
          // leftComponent={
          //   <Icon name="chevron-left" color={colors.black} size={30} />
          // }
          backgroundColor={colors.white}
          centerComponent={{
            text: 'Notifications',
            style: {color: colors.black, fontSize: 15},
          }}
          containerStyle={styles.headerCont}
        />
        {/* <View
          style={{
            paddingVertical: 15,
            backgroundColor: '#F7F8FA',
          }}>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={['Posts', 'Photos', 'Friends']}
            containerStyle={{height: 30, borderColor: colors.white4}}
            buttonStyle={{backgroundColor: colors.white4}}
            selectedButtonStyle={{backgroundColor: colors.white}}
            textStyle={{color: colors.gray4, fontWeight: 'normal'}}
            selectedTextStyle={{color: colors.black1}}
          />
        </View> */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.emptyContainerText}>Loading...</Text>
          </View>
        ) : (
          <FlatList
            style={styles.scrollView}
            contentContainerStyle={{flexGrow: 1, padding: 15}}
            data={notifications || []}
            keyExtractor={(item) => String(item.id)}
            renderItem={this.renderItem}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyContainerText}>
                  No Notifications yet
                </Text>
              </View>
            }
          />
        )}
      </View>
    );
  }
}

Notifications.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

Notifications.defaultProps = {};

const mapStateToProps = (state) => ({
  notifications: state.notifications,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
