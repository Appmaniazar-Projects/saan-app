import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import _ from 'lodash';
// import Share, {Options} from 'react-native-share';
// import PropTypes from 'prop-types';
import firestore from '@react-native-firebase/firestore';
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';
import colors from '../config/colors';
import {Timestamp, timestampToString} from '../utils';
import {
  CreatePostRequest,
  ToggleLikePostRequest,
} from '../redux/reducers/post/actions';

const {height, width} = Dimensions.get('window');

const PADDING = 0;

const imgWidth = width - PADDING * 2;
const imgHeight = (imgWidth * width) / height;

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: colors.white,
    marginBottom: 10,
    marginTop: 5,
  },
  cardTop: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLeftView: {
    height: 50,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.silver,
  },
  userRightView: {
    height: 50,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCenter: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  userName: {
    color: colors.black,
    fontSize: 16,
    marginBottom: 5,
  },
  dateText: {
    color: colors.silver,
    fontSize: 12,
  },
  cardMiddle: {
    width: imgWidth,
    height: imgHeight,
    backgroundColor: colors.primary,
  },
  postImage: {height: '100%', width: '100%'},
  cardButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  cardActionIcon: {
    height: 50,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardButtonText: {
    // flex: 1,
    color: colors.black,
    fontSize: 13,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBottom: {
    padding: 10,
  },
  description: {
    color: colors.black,
    fontSize: 15,
  },
});

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  like = () => {};

  dislike = () => {};

  comment = () => {
    if (_.isFunction(this.props.onCommentClick)) {
      this.props.onCommentClick();
    }
  };

  setPost = (item) => {
    console.log('setPost', item);
  };

  toggleLikePost = async () => {
    const {item, user, dispatch} = this.props;
    // this.setPost
    await dispatch(ToggleLikePostRequest(item.uid || 0, item));
  };

  shareToFeed = async () => {
    const {item: post, user, dispatch} = this.props;
    const userInfo = user?.user?.userInfo;
    try {
      const postData = {
        altText: '',
        content: post.content,
        create_at: Timestamp(),
        isVideo: false,
        permission: 1,
        notificationUsers: userInfo?.username ? [userInfo.username] : [],
        likes: [],
        tagUsername: [],
        source: post.source,
        // address: {
        //   ...address,
        //   keyword: generateUsernameKeywords(address.place_name || ''),
        // },
        userId: userInfo?.username,
      };
      console.log('postData', postData);
      await dispatch(CreatePostRequest(postData));
    } catch (error) {
      console.log(error);
    }
  };

  share = async () => {
    // const {item: post, user, dispatch} = this.props;
    // try {
    //   const options = {
    //     activityItemSources: [
    //       {
    //         // For sharing url with custom title.
    //         placeholderItem: {
    //           type: 'url',
    //           content:
    //             'https://www.facebook.com/photo.php?fbid=619895371910790',
    //         },
    //         item: {
    //           default: {
    //             type: 'url',
    //             content:
    //               'https://www.facebook.com/photo.php?fbid=619895371910790',
    //           },
    //         },
    //         subject: {
    //           default: post.content || '',
    //         },
    //         linkMetadata: {
    //           originalUrl:
    //             'https://www.facebook.com/photo.php?fbid=619895371910790',
    //           url: 'https://www.facebook.com/photo.php?fbid=619895371910790',
    //           // title: post.content
    //         },
    //       },
    //       {
    //         // For sharing text.
    //         placeholderItem: {type: 'text', content: post.content || ''},
    //         item: {
    //           default: {type: 'text', content: 'Hello....'},
    //           message: null, // Specify no text to share via Messages app.
    //         },
    //         linkMetadata: {
    //           // For showing app icon on share preview.
    //           title:
    //             'https://img.favpng.com/9/25/24/computer-icons-instagram-logo-sticker-png-favpng-LZmXr3KPyVbr8LkxNML458QV3.jpg',
    //         },
    //       },
    //       {
    //         // For using custom icon instead of default text icon at share preview when sharing with message.
    //         placeholderItem: {
    //           type: 'url',
    //           content: 'a',
    //         },
    //         item: {
    //           default: {
    //             type: 'text',
    //             content: `${post.ownUser?.username} has been posted a image`,
    //           },
    //         },
    //         linkMetadata: {
    //           title: `${post.ownUser?.username} has been posted a image`,
    //           icon:
    //             'https://img.favpng.com/9/25/24/computer-icons-instagram-logo-sticker-png-favpng-LZmXr3KPyVbr8LkxNML458QV3.jpg',
    //         },
    //       },
    //     ],
    //   };
    //   await Share.open({
    //     message: post.content,
    //     url: `https://www.saanapp.com/posts/${post.uid}`,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  delete = async (item) => {
    // collectionRef
    //   .where('name', '==', name)
    //   .get()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       doc.ref
    //         .delete()
    //         .then(() => {
    //           console.log('Document successfully deleted!');
    //         })
    //         .catch(function (error) {
    //           console.error('Error removing document: ', error);
    //         });
    //     });
    //   })
    //   .catch(function (error) {});
    try {
      let collectionRef = firestore().collection('posts');
      const querySnapshot = await collectionRef
        .where('uid', '==', item.uid)
        .get();
      querySnapshot.forEach(async (doc) => {
        try {
          await doc.ref.delete();
          console.log('Document successfully deleted!');
        } catch (error) {
          console.error('Error removing document: ', error);
        }
      });
      if (this.props.onRefresh) {
        this.props.onRefresh();
      }
    } catch (error) {
      console.log('Error getting documents: ', error);
      Alert.alert('Error', 'Error deleting post');
    }
  };

  askDelete = (item) => () => {
    console.log('ask delete', item);
    Alert.alert(
      'Warning',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => this.delete(item),
        },
        {
          text: 'No',
          style: 'default',
          onPress: () => {},
        },
      ],
      {cancelable: false},
    );
  };

  render() {
    const {item, user} = this.props;
    const username = user.user.userInfo?.username || ''
    const isLiked =
      item.likes &&
      item.likes?.indexOf(username) > -1;
    return (
      <View style={styles.postCard}>
        {!this.props.comment ? (
          <View style={styles.cardTop}>
            <View style={styles.userLeftView}>
              <Image
                source={{uri: item.ownUser?.avatarURL}}
                style={styles.userImage}
              />
            </View>

            <View style={styles.userCenter}>
              <Text style={styles.userName}>
                {item.ownUser?.fullname || item.ownUser?.username}
              </Text>
              <Text style={styles.dateText}>
                {timestampToString(item.create_at?.toMillis() || 0, true)}
              </Text>
            </View>

            {/* <TouchableOpacity style={styles.userRightView} activeOpacity={0.8}>
              <Icon
                name="dots-horizontal"
                type="material-community"
                color={colors.silver}
                size={30}
              />
            </TouchableOpacity> */}
            {item.userId === username ? (
              <TouchableOpacity
                style={styles.userRightView}
                onPress={this.askDelete(item)}
                activeOpacity={0.8}>
                <Icon
                  name="delete-circle"
                  type="material-community"
                  color={colors.pink}
                  size={30}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
        <View style={styles.cardBottom}>
          <Text style={styles.description}>{item.content}</Text>
        </View>
        {_.isArray(item.source) && item.source.length ? (
          <View style={styles.cardMiddle}>
            <FlatList
              horizontal
              pagingEnabled
              style={styles.postImage}
              contentContainerStyle={{flexGrow: 1}}
              data={item.source}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(ii, iIndex) => `${ii.uri}_${iIndex}`}
              renderItem={({item: subImage}) => {
                return (
                  <Image
                    style={styles.postImage}
                    source={{uri: subImage.uri}}
                  />
                );
              }}
            />
          </View>
        ) : null}
        <View style={styles.cardActions}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.cardButton}
            onPress={this.shareToFeed}>
            <Icon
              name="share"
              type="material-community"
              size={20}
              color={colors.silver}
              containerStyle={styles.cardActionIcon}
            />
            <Text style={[styles.cardButtonText, {flex: 1}]}>Share</Text>
          </TouchableOpacity>

          {!this.props.comment ? (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.cardButton}
              onPress={this.comment}>
              <Text style={[styles.cardButtonText]}>
                {item.comments && item.comments.length
                  ? item.comments.length
                  : ''}
              </Text>
              <Icon
                name="message-text-outline"
                type="material-community"
                size={20}
                color={colors.silver}
                containerStyle={styles.cardActionIcon}
              />
              <Text style={[styles.cardButtonText, {flex: 1}]}>
                {'Comment'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.cardButton} />
          )}

          <TouchableOpacity
            style={styles.cardButton}
            activeOpacity={0.9}
            onPress={this.toggleLikePost}>
            <Text style={[styles.cardButtonText]}>
              {item.likes && item.likes.length ? item.likes.length : ''}
            </Text>
            <Icon
              name={isLiked ? 'heart' : 'heart-outline'}
              color={isLiked ? colors.red : colors.silver}
              type="material-community"
              size={20}
              containerStyle={styles.cardActionIcon}
            />
            <Text style={[styles.cardButtonText, {flex: 1}]}>
              {isLiked ? 'Like' : 'Like'}
            </Text>
            {/* {item.likes && item.likes.length !== 0 && (
              <Text
                style={{
                  fontWeight: 'bold',
                  marginVertical: 5,
                }}>
                {item.likes.length >= 1000
                  ? Math.round(item.likes.length / 1000) + 'k'
                  : item.likes.length}{' '}
                {item.likes.length < 2 ? 'like' : 'likes'}
              </Text>
            )} */}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  // messages: state.messages,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
