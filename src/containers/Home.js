import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {connect} from 'react-redux';
import colors from '../config/colors';
import {Header, Icon} from 'react-native-elements';
import SearchComponent from '../components/SearchComponent';
import Post from '../components/Post';
import {
  FetchPostListRequest,
  LoadMorePostListRequest,
} from '../redux/reducers/post/actions';
import messaging from '@react-native-firebase/messaging';
// import {FetchStoryListRequest} from '../redux/reducers/story/actions';
import {LIMIT_POSTS_PER_LOADING} from '../redux/reducers/post/types';
import {
  setFcmToken,
  UpdateUserInfoRequest,
} from '../redux/reducers/user/actions';

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

  footerLoader: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
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
  rightContainerStyle: {
    height: 50,
    width: 50,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftContainerStyle: {
    height: 0,
    width: 0,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconView: {
    height: 36,
    width: 36,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  storyView: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  storyImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: colors.silver,
    marginBottom: 15,
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
  },
  sliderHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLeftText: {color: colors.black, fontSize: 24},
  sliderRightText: {color: colors.primary, fontSize: 16},
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: [
        {name: 'Thomas'},
        {name: 'Mike'},
        {name: 'Kevin'},
        {name: 'Grant'},
        {name: 'Ayanda'},
        {name: 'Thomas'},
        {name: 'Mike'},
        {name: 'Kevin'},
        {name: 'Grant'},
        {name: 'Ayanda'},
        {name: 'Thomas'},
        {name: 'Mike'},
        {name: 'Kevin'},
        {name: 'Grant'},
        {name: 'Ayanda'},
      ],
      posts: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      refreshing: false,
      loadingMore: false,
      loading: false,
    };
  }

  componentDidMount() {
    this.addNavigationEvents();
    this.load();
    this.configFCM();
  }

  componentWillUnmount() {
    this.removeNavigationEvents();
  }

  configFCM = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Authorization status:', authStatus);
        const token = await messaging().getToken();
        this.saveFcmToken(token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  saveFcmToken = async (token) => {
    const {user, dispatch} = this.props;
    const userInfo = user?.user?.userInfo;

    if (userInfo) {
      let notificationTokens = userInfo.notificationTokens;
      if (!_.isArray(notificationTokens)) {
        notificationTokens = [];
      }
      if (notificationTokens.indexOf(token) < 0) {
        notificationTokens.push(token);
      }
      dispatch(setFcmToken(token));
      await dispatch(
        UpdateUserInfoRequest({
          notificationTokens,
        }),
      );
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
    // this.load();
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
    const {dispatch} = this.props;
    console.log('load');
    this.setLoading(true);
    // await dispatch(FetchStoryListRequest());
    await dispatch(FetchPostListRequest());
    this.setLoading(false);
  };

  onRefresh = async () => {
    const {dispatch} = this.props;
    const {refreshing} = this.state;
    console.log('onRefresh');
    if (!refreshing) {
      this.setRefreshing(true);
      // await dispatch(FetchStoryListRequest());
      await dispatch(FetchPostListRequest());
      this.setRefreshing(false);
    }
  };

  onLoadMore = async () => {
    const {dispatch} = this.props;
    const {loadingMore, refreshing} = this.state;
    console.log('onLoadMore');
    if (!loadingMore && !refreshing) {
      this.setLoadingMore(true);
      await dispatch(LoadMorePostListRequest());
      this.setLoadingMore(false);
    }
  };

  onCommentClick = (item) => () => {
    const {navigation} = this.props;
    navigation.navigate('Comments', {item});
  };

  allNetwork = () => {
    const {navigation} = this.props;
    navigation.navigate('FindFriends');
  };

  startPost = () => {
    const {navigation} = this.props;
    navigation.navigate('StartPost');
  };

  renderHeader = () => {
    const {storyList} = this.props;
    if (_.isArray(storyList) || storyList.length) {
      return null;
    }
    return (
      <View style={styles.listHeader}>
        <View style={styles.sliderHead}>
          <Text style={styles.sliderLeftText}>Network</Text>
          <Text onPress={this.allNetwork} style={styles.sliderRightText}>
            See All
          </Text>
        </View>
        <FlatList
          horizontal
          style={styles.w100}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flexGrow}
          data={this.props.storyList}
          keyExtractor={(item, index) => String(`${item.name}_${index}`)}
          renderItem={({item}) => {
            return (
              <View style={styles.storyView}>
                <Image uri={{uri: ''}} style={styles.storyImage} />
                <Text style={styles.storyName}>{item.name}</Text>
              </View>
            );
          }}
        />
      </View>
    );
  };

  render() {
    const {postList, storyList} = this.props;
    // console.log('postList', postList);
    // console.log('storyList', storyList);
    const {refreshing, loadingMore, loading} = this.state;
    return (
      <View style={styles.container}>
        <Header
          barStyle="dark-content"
          statusBarProps={{
            backgroundColor: colors.white,
          }}
          rightContainerStyle={styles.rightContainerStyle}
          leftContainerStyle={styles.leftContainerStyle}
          leftComponent={null}
          rightComponent={
            <Icon
              name="ios-add"
              type="ionicon"
              color={colors.white}
              size={26}
              containerStyle={styles.addIconView}
              onPress={this.startPost}
              // onPress={() => navigation.goBack()}
            />
          }
          centerContainerStyle={styles.centerContainerStyle}
          centerComponent={<SearchComponent />}
          backgroundColor="#0000"
          containerStyle={styles.headerCont}
        />
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.emptyContainerText}>Loading...</Text>
          </View>
        ) : (
          <FlatList
            ListHeaderComponent={this.renderHeader}
            data={postList || []}
            keyExtractor={(item, index) => String(`${item.name}_${index}`)}
            style={styles.scrollView}
            contentContainerStyle={styles.flexGrow}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <Post
                item={item}
                onCommentClick={this.onCommentClick(item)}
                onRefresh={this.onRefresh}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyContainerText}>No Posts found</Text>
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
              (postList || []).length < LIMIT_POSTS_PER_LOADING
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

Home.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

Home.defaultProps = {};

const mapStateToProps = (state) => ({
  storyList: state.storyList,
  postList: state.postList,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
