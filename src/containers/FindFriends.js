import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
// import {firestore} from 'firebase';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';
import {Button, Header, Icon, Input} from 'react-native-elements';
// import {CreateEmptyConversationRequest} from '../redux/reducers/message/actions';
import {
  // FetchExtraInfoRequest,
  ToggleFollowUserRequest,
  ToggleSendFollowRequest,
  // UnSuggestionRequest,
} from '../redux/reducers/user/actions';
// import SearchComponent from '../components/SearchComponent';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerCont: {
    borderBottomWidth: 0,
    backgroundColor: colors.gray,
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

  inputStyle: {
    fontSize: 14,
  },
  inputContainerStyle: {
    backgroundColor: '#FFF',
    height: 40,
    borderRadius: 10,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  containerStyle: {width: '100%'},

  listHeader: {
    paddingVertical: 20,
    backgroundColor: '#FFF',
  },
  sliderHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLeftText: {
    color: colors.black,
    fontSize: 16,
  },
  sliderRightText: {
    color: colors.primary,
    fontSize: 16,
  },
  itemView: {width: width, padding: 10},
  itemMain: {
    flex: 1,
    backgroundColor: colors.gray,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  itemAvatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: '#707070',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  avatarImage: {height: '100%', width: '100%'},
  itemRight: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  itemName: {
    color: colors.black,
    fontSize: 17,
    marginBottom: 5,
  },
  itemSubText: {
    color: colors.silver,
    fontSize: 17,
  },
  connectButton: {
    borderColor: colors.primary,
    borderRadius: 5,
    height: 24,
    padding: 0,
    paddingHorizontal: 5,
  },
  connectButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'normal',
    textTransform: 'capitalize',
  },
  userNameText: {
    color: colors.silver,
    fontSize: 17,
  },
  userFullName: {
    color: colors.black,
    fontSize: 17,
    marginBottom: 5,
  },
  userContentView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  userAvatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderColor: '#707070',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  userAvatarImage: {
    height: '100%',
    width: '100%',
  },
  userItemView: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainerText: {
    fontSize: 20,
    color: colors.silver,
  },
  footerLoader: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const LIMIT_USERS_PER_LOADING = 20;

class FindFriends extends Component {
  constructor(props) {
    super(props);
    this.queryTimeout = null;
    this.state = {
      refreshing: false,
      loadingMore: false,
      loading: false,
      searching: false,
      query: '',
      suggests: [{}, {}, {}],
      users: [{}, {}, {}, {}, {}],
      resultList: [],
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
    // const {dispatch} = this.props;
    // dispatch(FetchExtraInfoRequest());
    this.load();
  };

  // eslint-disable-next-line no-unused-vars
  onWillBlur = (payload) => {};

  setRefreshing = (bool) => {
    // refreshing
    this.setState({refreshing: bool});
  };
  setLoadingMore = (bool) => {
    // refreshing
    this.setState({loadingMore: bool});
  };

  setLoading = (bool) => {
    this.setState({loading: bool});
  };

  load = async () => {
    const {query} = this.state;
    console.log('load');
    this.setLoading(true);
    // await dispatch(FetchStoryListRequest());
    // await this.getUsers();
    await this.onSearchChange(query);
    this.setLoading(false);
  };

  onRefresh = async () => {
    const {dispatch} = this.props;
    const {refreshing, query} = this.state;
    console.log('onRefresh');
    if (!refreshing) {
      this.setRefreshing(true);
      // await dispatch(FetchStoryListRequest());
      // await dispatch(FetchPostListRequest());
      await this.onSearchChange(query);
      this.setRefreshing(false);
    }
  };

  onLoadMore = async () => {
    const {dispatch} = this.props;
    const {loadingMore, refreshing, query} = this.state;
    console.log('onLoadMore');
    if (!loadingMore && !refreshing) {
      this.setLoadingMore(true);
      // await dispatch(LoadMorePostListRequest());
      // await this.onSearchChange(query, true);
      this.setLoadingMore(false);
    }
  };

  getUsers = async () => {
    try {
      const {user} = this.props;
      const myUsername = user.user.userInfo?.username;
      // console.log('searchUsers=>', q);
      // console.log('searchUsers=>', myUsername);
      const ref = firestore();
      const rq = await ref.collection('users').doc(`${myUsername}`).get();
      const myUserInfo = rq.data() || {};
      const currentFollowings = myUserInfo.followings || [];
      const currentCloseFriends =
        myUserInfo.privacySetting?.closeFriends?.closeFriends || [];
      const currentBlockAccounts =
        myUserInfo.privacySetting?.blockedAccounts?.blockedAccounts || [];
      const rq2 = await ref
        .collection('users')
        .where('username', '!=', '')
        .limit(500)
        .get();
      console.log('searchUsers=>', rq2);
      let resultList = rq2.docs.map((doc) => doc.data() || {});
      resultList = resultList.filter(
        (usr) =>
          (usr.privacySetting?.blockedAccounts?.blockedAccounts || []).indexOf(
            `${myUsername}`,
          ) < 0 &&
          usr.username !== myUsername &&
          currentBlockAccounts.indexOf(`${usr.username}`) < 0,
      );
      resultList.sort((a, b) => {
        let aScore = 0;
        let bScore = 0;
        if (currentCloseFriends.indexOf(`${a.username}`) > -1) {
          aScore = 2;
        } else if (currentFollowings.indexOf(`${a.username}`) > -1) {
          aScore = 1;
        }
        if (currentCloseFriends.indexOf(`${b.username}`) > -1) {
          bScore = 2;
        } else if (currentFollowings.indexOf(`${b.username}`) > -1) {
          bScore = 1;
        }
        return bScore - aScore;
      });
      // return resultList;
      this.setState({resultList});
    } catch (error) {
      console.log(error);
    }
  };

  searchUsers = async (q) => {
    const {user} = this.props;
    const myUsername = user.user.userInfo?.username;
    // console.log('searchUsers=>', q);
    // console.log('searchUsers=>', myUsername);
    const ref = firestore();
    const rq = await ref.collection('users').doc(`${myUsername}`).get();
    const myUserInfo = rq.data() || {};
    const currentFollowings = myUserInfo.followings || [];
    const currentCloseFriends =
      myUserInfo.privacySetting?.closeFriends?.closeFriends || [];
    const currentBlockAccounts =
      myUserInfo.privacySetting?.blockedAccounts?.blockedAccounts || [];
    const rq2 = await ref
      .collection('users')
      .where('keyword', 'array-contains', q.trim().toLowerCase())
      .limit(100)
      .get();
    // console.log('searchUsers=>', rq2);
    let resultList = rq2.docs.map((doc) => doc.data() || {});
    resultList = resultList.filter(
      (usr) =>
        (usr.privacySetting?.blockedAccounts?.blockedAccounts || []).indexOf(
          `${myUsername}`,
        ) < 0 &&
        usr.username !== myUsername &&
        currentBlockAccounts.indexOf(`${usr.username}`) < 0,
    );
    resultList.sort((a, b) => {
      let aScore = 0;
      let bScore = 0;
      if (currentCloseFriends.indexOf(`${a.username}`) > -1) {
        aScore = 2;
      } else if (currentFollowings.indexOf(`${a.username}`) > -1) {
        aScore = 1;
      }
      if (currentCloseFriends.indexOf(`${b.username}`) > -1) {
        bScore = 2;
      } else if (currentFollowings.indexOf(`${b.username}`) > -1) {
        bScore = 1;
      }
      return bScore - aScore;
    });
    return resultList;
  };

  onSearchChange = async (query) => {
    console.log('onSearchChange =>', query);
    try {
      this.setState({query, searching: true}, () => {
        if (this.queryTimeout) {
          clearTimeout(this.queryTimeout);
        }
        if (query.length > 0) {
          this.queryTimeout = setTimeout(async () => {
            const result = await this.searchUsers(query);
            this.setState({resultList: result});
          }, 300);
        } else {
          // this.setState({resultList: []});
          this.getUsers();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  connect = (item) => () => {
    const {dispatch, navigation} = this.props;
    dispatch(ToggleFollowUserRequest(item.username));
    navigation.navigate('MessageDetails', {
      username: item.username,
    });
  };

  onToggleFollow = (index) => {
    const {suggests} = this.state;
    const {dispatch} = this.props;
    let temp = [...suggests];
    if (temp[index].followType === 1) {
      dispatch(ToggleFollowUserRequest(temp[index].username || ''));
      temp[index].followType = 2;
    } else if (temp[index].followType === 2) {
      if (temp[index].private) {
        dispatch(ToggleSendFollowRequest(temp[index].username || ''));
        temp[index].followType = 3;
      } else {
        dispatch(ToggleFollowUserRequest(temp[index].username || ''));
        temp[index].followType = 1;
      }
    } else {
      dispatch(ToggleSendFollowRequest(temp[index].username || ''));
      temp[index].followType = 2;
    }
    this.setState({suggests: temp});
  };

  onRefresh = async () => {
    const {dispatch} = this.props;
    this.setState({loading: true});
    // await dispatch(FetchExtraInfoRequest());
    this.setState({loading: false});
  };

  renderHeader = () => {
    const {suggests} = this.state;
    const {user} = this.props;
    const {extraInfo} = user;
    return (
      <View style={styles.listHeader}>
        <View style={styles.sliderHead}>
          <Text style={styles.sliderLeftText}>YOU MAY KNOW</Text>
          <Text style={styles.sliderRightText}>See All</Text>
        </View>
        <FlatList
          horizontal
          style={styles.w100}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flexGrow}
          data={suggests}
          onRefresh={this.onRefresh}
          refreshing={this.state.loading}
          pagingEnabled
          keyExtractor={(item, index) => String(`${item.name}_${index}`)}
          renderItem={({item}) => {
            return (
              <View style={styles.itemView}>
                <View style={styles.itemMain}>
                  <View style={styles.itemAvatar}>
                    <Image source={{uri: ''}} style={styles.avatarImage} />
                  </View>
                  <View style={styles.itemRight}>
                    <Text style={styles.itemName}>Mpho Matamela</Text>
                    <Text style={styles.itemSubText}>3 mutual friends</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />

        <View style={styles.sliderHead}>
          <Text style={styles.sliderLeftText}>NETWORK</Text>
          {/* <Text style={styles.sliderRightText}>See All</Text> */}
        </View>
      </View>
    );
  };

  render() {
    const {navigation} = this.props;
    const {resultList, loading, refreshing, loadingMore} = this.state;
    return (
      <View style={styles.container}>
        <Header
          barStyle="dark-content"
          statusBarProps={{
            backgroundColor: colors.white,
          }}
          centerComponent={<Text style={styles.headerText}>Find Network</Text>}
          leftComponent={
            <Icon
              name="chevron-left"
              color={colors.black}
              size={30}
              onPress={() => navigation.goBack()}
            />
          }
          rightComponent={
            <Icon
              name="dots-three-vertical"
              type="entypo"
              color={colors.black}
              size={15}
            />
          }
          backgroundColor="#0000"
          containerStyle={styles.headerCont}
        />
        <View
          style={{padding: 10, width: '100%', backgroundColor: colors.gray}}>
          <Input
            placeholder="Search"
            renderErrorMessage={false}
            placeholderTextColor={colors.silver}
            leftIcon={
              <Icon
                name="ios-search"
                type="ionicon"
                color={colors.silver}
                size={20}
              />
            }
            value={this.state.query}
            onChangeText={this.onSearchChange}
            inputStyle={styles.inputStyle}
            autoCapitalize="none"
            autoCorrect={false}
            inputContainerStyle={styles.inputContainerStyle}
            containerStyle={styles.containerStyle}
          />
        </View>
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.emptyContainerText}>Loading...</Text>
          </View>
        ) : (
          <FlatList
            // ListHeaderComponent={this.renderHeader}
            data={resultList}
            keyExtractor={(item, index) => String(`${item.name}_${index}`)}
            style={styles.scrollView}
            contentContainerStyle={styles.flexGrow}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              console.log(item);
              return (
                <View style={styles.userItemView}>
                  <View style={styles.userAvatar}>
                    <Image
                      source={{uri: item.avatarURL}}
                      style={styles.userAvatarImage}
                    />
                  </View>
                  <View style={styles.userContentView}>
                    <Text style={styles.userFullName}>{item.fullname}</Text>
                    <Text
                      style={styles.userNameText}>{`@${item.username}`}</Text>
                  </View>
                  <View>
                    <Button
                      title="Connect"
                      onPress={this.connect(item)}
                      type="outline"
                      buttonStyle={styles.connectButton}
                      titleStyle={styles.connectButtonText}
                    />
                  </View>
                </View>
              );
            }}

            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyContainerText}>No Users found</Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.onRefresh}
              />
            }
            onEndReachedThreshold={0.1}
            refreshing={refreshing}
            onRefresh={this.onRefresh}
            onEndReached={
              (resultList || []).length < LIMIT_USERS_PER_LOADING
                ? null
                : this.onLoadMore
            }
            ListFooterComponent={
              loadingMore && (
                <View style={styles.footerLoader}>
                  <ActivityIndicator color={colors.primary} size="small" />
                </View>
              )
            }
          />
        )}
      </View>
    );
  }
}

FindFriends.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

FindFriends.defaultProps = {};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(FindFriends);
