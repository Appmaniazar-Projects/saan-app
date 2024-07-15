import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';
import images from '../config/images';
import {Header, Icon, Input} from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Post from '../components/Post';
import {
  FetchCommentListRequest,
  LoadMoreCommentListRequest,
} from '../redux/reducers/comment/actions';
import {PostCommentRequest} from '../redux/reducers/post/actions';
import { timestampToString } from '../utils';

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
    backgroundColor: '#FFF',
  },
  flexGrow: {
    flexGrow: 1,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },
  View: {
    backgroundColor: colors.white,
    height: 420,
    width: '100%',
    borderRadius: 10,
    marginBottom: 20,
  },
  MainView: {
    flexDirection: 'row',
    padding: 10,
  },
  Title: {
    color: colors.black,
    fontSize: 20,
    // fontFamily: fonts.semibold,
  },
  UserName: {
    color: colors.black,
    // fontFamily: fonts.semibold,
    fontSize: 17,
  },
  NameView: {padding: 5, paddingLeft: 10},
  HoursText: {color: colors.silver, fontSize: 12},
  ImageStyle: {height: 50, width: 50, borderRadius: 30},
  TipsText: {paddingLeft: 70},
  Reply: {paddingLeft: 70, padding: 20},
  TitleRow: {borderBottomWidth: 1, borderColor: colors.white2},
  Tips: {color: colors.black, fontSize: 15},
  ReplyText: {color: colors.silver, fontSize: 15},

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
});

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loadingMore: false,
      commenting: false,
      data: [
        {
          id: 1,
          // title: 'Comments',
          name: 'Grant Bellairs',
          image: images.ButterflyLogo,
          subText: '2 hours ago',
          tips:
            'If you are an entrepreneur, you know that your success cannot depend on the opinions of others.',
        },
        {
          id: 2,
          name: 'Nolitha January',
          image: images.flowerLogo,
          subText: '3 hours ago',
          tips:
            'I am upset. At this moment, as I sit here typing this up, I am truly upset. Something happened a little while ago.',
        },
      ],
    };
  }

  componentDidMount() {
    this.addNavigationEvents();
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
  onDidFocus = (payload) => {};

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

  getPost = () => {
    const {route} = this.props;
    let post = null;
    if (route.params && route.params.item) {
      post = route.params.item;
    }
    return post;
  };

  load = async () => {
    const {dispatch} = this.props;
    const post = this.getPost();
    this.setRefreshing(true);
    // await dispatch(FetchStoryListRequest());
    await dispatch(FetchCommentListRequest(post?.uid || '', post));
    this.setRefreshing(false);
  };

  onRefresh = async () => {
    const {dispatch} = this.props;
    const {refreshing} = this.state;
    const post = this.getPost();
    if (!refreshing) {
      this.setRefreshing(true);
      await dispatch(FetchCommentListRequest(post?.uid || '', post));
      this.setRefreshing(false);
    }
  };
  onLoadMore = async () => {
    const {dispatch} = this.props;
    const {loadingMore} = this.state;
    const post = this.getPost();
    if (!loadingMore) {
      this.setLoadingMore(true);
      await dispatch(LoadMoreCommentListRequest(post?.uid || ''));
      this.setLoadingMore(false);
    }
  };

  addComment = async () => {
    const {newcomment} = this.state;
    const {dispatch} = this.props;
    try {
      this.setState({commenting: true});
      const post = this.getPost();
      await dispatch(PostCommentRequest(post?.uid, newcomment));
      this.setState({commenting: false, newcomment: ''});
    } catch (error) {
      console.log(error);
      this.setState({commenting: false});
    }
  };

  renderItem = ({item}) => {
    console.log(item);
    return (
      <View>
        <View style={styles.MainView}>
          <Image
            source={{
              uri: item.ownUser?.avatarURL,
            }}
            style={styles.ImageStyle}
          />
          <View style={styles.NameView}>
            <Text style={styles.UserName}>
              {item?.ownUser?.fullname || item?.ownUser?.username || ''}
            </Text>
            <Text style={styles.HoursText}>
              {timestampToString(item.create_at?.toMillis() || 0)}
            </Text>
          </View>
        </View>
        <View style={styles.TitleRow}>
          <View style={styles.TipsText}>
            <Text style={styles.Tips}>{item.content}</Text>
          </View>
          <View style={styles.Reply}>
            {/* <Text style={styles.ReplyText}></Text> */}
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {comment} = this.props;
    const {newcomment, commenting} = this.state;
    const post = this.getPost();
    console.log('comment', comment);
    const btnDisable = commenting || !newcomment || newcomment.trim() === '';
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
              size={30}
              onPress={this.props.navigation.goBack}
            />
          }
          backgroundColor={colors.white}
          centerComponent={{
            text: 'Username',
            style: {color: colors.black, fontSize: 15},
          }}
          rightComponent={
            <Icon
              name="dots-three-vertical"
              type="entypo"
              color={colors.black}
              size={15}
            />
          }
          containerStyle={styles.headerCont}
        />

        <FlatList
          data={comment.comments || []}
          style={styles.scrollView}
          contentContainerStyle={styles.flexGrow}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyContainerText}>No Comments yet</Text>
            </View>
          }
          ListHeaderComponent={
            <>
              {post && <Post item={post} comment />}
              <View style={{padding: 10}}>
                <Text style={styles.Title}>{'Comments'}</Text>
              </View>
            </>
          }
          renderItem={this.renderItem}
        />
        <View
          style={{
            // height: 75,
            flexDirection: 'row',
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: colors.silver2,
          }}>
          <View style={{flex: 1}}>
            <Input
              placeholder="Write a comment ..."
              placeholderTextColor={colors.white1}
              disabled={commenting}
              inputContainerStyle={{
                backgroundColor: '#FFF',
                borderRadius: 18,
                borderBottomWidth: StyleSheet.hairlineWidth,
                height: 36,
                paddingHorizontal: 20,
                borderColor: colors.white1,
                borderWidth: StyleSheet.hairlineWidth,
              }}
              value={newcomment}
              onChangeText={(val) => {
                this.setState({newcomment: val});
              }}
              inputStyle={{
                fontSize: 14,
              }}
            />
          </View>
          <Icon
            name="md-send-sharp"
            type="ionicon"
            color={btnDisable ? colors.gray : colors.primary}
            disabled={btnDisable}
            onPress={this.addComment}
            size={28}
            Component={TouchableOpacity}
            disabledStyle={{
              backgroundColor: '#0000',
            }}
            containerStyle={{
              width: 60,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          {Platform.OS === 'ios' ? <KeyboardSpacer /> : null}
        </View>
      </View>
    );
  }
}

Comments.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

Comments.defaultProps = {};

const mapStateToProps = (state) => ({
  comment: state.comment,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
