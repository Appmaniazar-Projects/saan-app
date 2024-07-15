import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';
import {Header, Icon} from 'react-native-elements';
import {TriggerMessageListenerRequest} from '../redux/reducers/message/actions';
import {timestampToString} from '../utils';
import moment from 'moment';
import {seenTypes} from '../redux/reducers/story/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerCont: {
    borderBottomWidth: 0,
    backgroundColor: '#FFF',
  },
  headerText: {
    color: colors.black,
    fontSize: 17,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F3F6',
  },
  flexGrow: {
    flexGrow: 1,
  },
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
  emptyContainerText: {fontSize: 20, color: colors.silver},
  storyView: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    position: 'relative',
  },
  storyImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: colors.silver,
    marginBottom: 15,
    borderColor: '#707070',
    borderWidth: StyleSheet.hairlineWidth,
  },
  onlineCircle: {
    position: 'absolute',
    height: 12,
    width: 12,
    borderRadius: 6,
    bottom: 12,
    right: 12,
    borderColor: colors.white,
    borderWidth: 2,
    zIndex: 1122,
    backgroundColor: '#7ED321',
  },
  storyName: {
    fontSize: 12,
    color: colors.silver,
  },
  w100: {
    width: '100%',
  },
  listHeader: {
    paddingVertical: 20,
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  sliderHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLeftText: {
    color: colors.black,
    fontSize: 17,
  },
  sliderRightText: {
    color: colors.primary,
    fontSize: 16,
  },
  badge: {
    position: 'absolute',
    height: 20,
    width: 20,
    borderRadius: 10,
    bottom: 10,
    right: 10,
    borderColor: colors.white,
    borderWidth: 2,
    zIndex: 1122,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
  },
  chatItem: {
    flexDirection: 'row',
    // padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  chatItemLeft: {
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    // marginRight: 15,
    padding: 10,
    position: 'relative',
  },
  chatItemImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderColor: '#707070',
    borderWidth: StyleSheet.hairlineWidth,
  },
  chatItemRight: {
    flex: 1,
    height: 80,
    padding: 10,
    borderBottomColor: '#707070',
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  chatItemUserNameView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chatItemUserName: {
    fontSize: 17,
    color: colors.black,
  },
  chatItemUserTime: {
    fontSize: 15,
    color: colors.silver,
  },
  chatItemMessageView: {},
  chatItemMessageText: {
    fontSize: 17,
    color: colors.silver,
  },
});

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [
        {
          id: 1,
          name: 'Sagar',
          image: {
            uri:
              'https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png',
          },
          time: '04:04AM',
          subText: 'Hey! Hows it going?',
        },
        {
          id: 2,
          name: 'Ayanda Siboto',
          // image: images.AyandaLogo,
          time: '04:04AM',
          subText: 'What kind of music do you like?',
        },
        {
          id: 3,
          name: 'Nolitha January',
          // image: images.NolithaLogo,
          time: '04:04AM',
          subText: 'Sounds good to me!',
        },

        {
          id: 4,
          name: 'Mpho Matamela',
          // image: images.MphoLogo,
          time: '04:04AM',
          subText: 'Hi Mona. Hows your night going?',
        },
        {
          id: 5,
          name: 'Walusungu Ngulube',
          // image: images.WalusunguLogo,
          time: '04:04AM',
          subText: 'What did you do over the weekend?',
        },

        {
          id: 6,
          name: 'Sagar',
          image: {
            uri:
              'https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png',
          },
          time: '04:04AM',
          subText: 'Hey! Hows it going?',
        },
        {
          id: 7,
          name: 'Ayanda Siboto',
          // image: images.AyandaLogo,
          time: '04:04AM',
          subText: 'What kind of music do you like?',
        },
        {
          id: 8,
          name: 'Nolitha January',
          // image: images.NolithaLogo,
          time: '04:04AM',
          subText: 'Sounds good to me!',
        },

        {
          id: 9,
          name: 'Mpho Matamela',
          // image: images.MphoLogo,
          time: '04:04AM',
          subText: 'Hi Mona. Hows your night going?',
        },
        {
          id: 10,
          name: 'Walusungu Ngulube',
          // image: images.WalusunguLogo,
          time: '04:04AM',
          subText: 'What did you do over the weekend?',
        },
      ],
      online: [
        {id: 1, subname: 'Manelisi'},
        {id: 2, subname: 'Grant'},
        {id: 3, subname: 'Walusungu'},
        {id: 4, subname: 'Ayanda'},
        {id: 5, subname: 'Nolitha'},
        {id: 6, subname: 'Mpho'},
      ],
      loading: false,
    };
  }

  componentDidMount() {
    this.addNavigationEvents();
    // this.props.dispatch(TriggerMessageListenerRequest());
    this.load();
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
    
  };

  // eslint-disable-next-line no-unused-vars
  onWillBlur = (payload) => {};

  findFriends = () => {
    const {navigation} = this.props;
    navigation.navigate('FindFriends');
  };

  setLoading = (bool) => {
    this.setState({loading: bool});
  };

  load = async () => {
    const {dispatch} = this.props;
    console.log('load');
    this.setLoading(true);
    // await dispatch(FetchStoryListRequest());
    await dispatch(TriggerMessageListenerRequest());
    this.setLoading(false);
  };

  openChat = (item) => () => {
    const {navigation} = this.props;
    navigation.navigate('MessageDetails', {
      username: item.ownUser.username,
    });
  };

  renderHeader = () => {
    const {navigation, messages} = this.props;
    const {user} = this.props;
    // const {users} = this.state;
    // console.log('messages', messages);
    const time = moment().unix();
    const dmessages = messages.filter(
      (x) => x.online && x.online.status === 1 && x.online.last_online <= time,
    );
    // const dmessages = messages.filter((x) => !!x.online);
    // const myUsername = user.user.userInfo?.username || '';
    return (
      <View style={styles.listHeader}>
        <View style={styles.sliderHead}>
          <Text style={styles.sliderLeftText}>ONLINE USERS</Text>
        </View>
        <FlatList
          horizontal
          style={styles.w100}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flexGrow}
          data={dmessages}
          ListEmptyComponent={
            <View
              style={{
                // flex: 1,
                width: '100%',
                minHeight: 100,
                backgroundColor: colors.white,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 20, color: colors.silver}}>
                No Online users found
              </Text>
            </View>
          }
          keyExtractor={(item, index) => String(`${item.name}_${index}`)}
          renderItem={({item}) => {
            return (
              <View style={styles.storyView}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={this.openChat(item)}
                  style={{position: 'relative'}}>
                  <Image
                    source={{uri: item.ownUser.avatarURL}}
                    style={styles.storyImage}
                  />
                  <View style={styles.onlineCircle} />
                </TouchableOpacity>
                <Text numberOfLines={1} style={styles.storyName}>
                  {item.ownUser.fullname || item.ownUser.username || ''}
                </Text>
              </View>
            );
          }}
        />
      </View>
    );
  };

  render() {
    const {navigation, messages} = this.props;
    const {user} = this.props;
    const {loading} = this.state;
    console.log('loading', loading);
    const dmessages = messages.filter((x) => x.messageList.length > 0);
    const myUsername = user.user.userInfo?.username || '';
    return (
      <View style={styles.container}>
        <Header
          barStyle="dark-content"
          statusBarProps={{
            backgroundColor: colors.white,
          }}
          centerComponent={<Text style={styles.headerText}>Messages</Text>}
          // leftComponent={
          //   <Icon
          //     name="chevron-left"
          //     color={colors.black}
          //     size={30}
          //     onPress={() => navigation.goBack()}
          //   />
          // }
          rightComponent={
            <Icon
              name="user-plus"
              type="font-awesome"
              color={colors.black}
              size={24}
              onPress={this.findFriends}
            />
          }
          backgroundColor="#0000"
          containerStyle={styles.headerCont}
        />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.emptyContainerText}>Loading...</Text>
          </View>
        ) : (
          <FlatList
            ListHeaderComponent={this.renderHeader}
            data={dmessages}
            keyExtractor={(item, index) => String(`${item.name}_${index}`)}
            style={styles.scrollView}
            contentContainerStyle={styles.flexGrow}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyContainerText}>
                  No Conversions found
                </Text>
              </View>
            }
            renderItem={({item}) => {
              const isMyMessage = item.messageList[0].userId === myUsername;
              const unRead =
                !isMyMessage && item.messageList[0].seen === seenTypes.NOTSEEN;
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.chatItem}
                  onPress={this.openChat(item)}>
                  <View style={styles.chatItemLeft}>
                    <Image
                      source={{uri: item.ownUser.avatarURL}}
                      style={styles.chatItemImage}
                    />
                    {/* <View style={styles.badge}>
                    <Text style={styles.badgeText}>{3}</Text>
                  </View> */}
                  </View>
                  <View style={styles.chatItemRight}>
                    <View style={styles.chatItemUserNameView}>
                      <Text style={styles.chatItemUserName}>
                        {item.ownUser.fullname || item.ownUser.username || ''}
                      </Text>
                      <Text style={styles.chatItemUserTime}>
                        {timestampToString(item.messageList[0].create_at)}
                      </Text>
                    </View>
                    <View style={styles.chatItemMessageView}>
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.chatItemMessageText,
                          unRead ? {color: colors.black} : null,
                        ]}>
                        {item.messageList[0].image
                          ? 'Image'
                          : item.messageList[0].text}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    );
  }
}

Messages.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

Messages.defaultProps = {};

const mapStateToProps = (state) => ({
  messages: state.messages,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
