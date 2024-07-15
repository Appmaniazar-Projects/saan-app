// import {firestore} from 'firebase';
import firestore from '@react-native-firebase/firestore';
import {notificationTypes} from '../notification/types';
import {LIMIT_POSTS_PER_LOADING, postActionTypes} from './types';
import {store} from '../../store/configureStore';
import {
  generateUsernameKeywords,
  Timestamp,
  getImageClass,
} from '../../../utils';
import {LoadMoreCommentListSuccess} from '../comment/actions';
import {CreateNotificationRequest} from '../notification/actions';

export const FetchPostListRequest = () => {
  return async (dispatch) => {
    try {
      const me = store.getState().user.user;
      const myUsername = `${store.getState().user.user.userInfo?.username}`;
      const currentBlockedList =
        store.getState().user.setting?.privacy?.blockedAccounts
          ?.blockedAccounts || [];
      const userRef = firestore().collection('users');
      const blockMe = await userRef
        .where(
          'privacySetting.blockedAccounts.blockedAccounts',
          'array-contains',
          myUsername,
        )
        .get();
      const blockedMeList = blockMe.docs.map((x) => x.data().username);
      const request = await firestore()
        .collection('users')
        .doc(me.userInfo?.username)
        .get();
      const result = request.data() || {};
      if (result) {
        const follwingList = result.followings || [];
        const userIds = [];
        let collection = [];
        while (
          follwingList.length > 0 &&
          collection.length < LIMIT_POSTS_PER_LOADING
        ) {
          const rs = await firestore()
            .collection('posts')
            .where('userId', 'in', follwingList.splice(0, 10))
            .orderBy('create_at', 'desc')
            .limit(LIMIT_POSTS_PER_LOADING - collection.length)
            .get();
          console.log(rs);
          const temp = rs.docs
            .map((doc) => {
              if (userIds.indexOf(doc.data().userId) < 0) {
                userIds.push(doc.data().userId);
              }
              let post = Object.assign({}, doc.data());
              const rqCmt = doc.ref
                .collection('comments')
                .orderBy('create_at', 'desc')
                .get();
              // console.log(rqCmt);
              rqCmt.then((rsx) => {
                post.comments = rsx.docs.map((docx) => docx.data());
              });
              return post;
            })
            .filter(
              (x) =>
                currentBlockedList.indexOf(`${x.userId}`) < 0 &&
                blockedMeList.indexOf(`${x.userId}`) < 0,
            );
          collection = collection.concat(temp);
        }
        let ownInfos = [];
        while (userIds.length > 0) {
          const rs = await firestore()
            .collection('users')
            .where('username', 'in', userIds.splice(0, 10))
            .get();
          const temp = rs.docs.map((doc) => {
            return doc.data();
          });
          ownInfos = ownInfos.concat(temp);
        }
        const extraPostList = collection.map((post, index) => {
          const extraPost = Object.assign(post, {
            ownUser: ownInfos.filter((x) => x.username === post.userId)[0],
          });
          return extraPost;
        });
        dispatch(FetchPostListSuccess(extraPostList));
      } else {
        dispatch(FetchPostListFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(FetchPostListFailure());
    }
  };
};
export const FetchPostListFailure = () => {
  return {
    type: postActionTypes.FETCH_POST_LIST_FAILURE,
    payload: {
      message: 'Get Post List Failed!',
    },
  };
};
export const FetchPostListSuccess = (payload) => {
  return {
    type: postActionTypes.FETCH_POST_LIST_SUCCESS,
    payload: payload,
  };
};
/**
 * LOADING MORE ACTIONS
 */
export const LoadMorePostListRequest = () => {
  return async (dispatch) => {
    try {
      const me = store.getState().user.user;
      const myUsername = `${store.getState().user.user.userInfo?.username}`;
      const currentBlockedList =
        store.getState().user.setting?.privacy?.blockedAccounts
          ?.blockedAccounts || [];
      const userRef = firestore().collection('users');
      const blockMe = await userRef
        .where(
          'privacySetting.blockedAccounts.blockedAccounts',
          'array-contains',
          myUsername,
        )
        .get();
      const blockedMeList = blockMe.docs.map((x) => x.data().username);
      const request = await firestore()
        .collection('users')
        .doc(me.userInfo?.username)
        .get();
      const result = request.data();
      const loadedUids = store
        .getState()
        .postList.map((post) => post.uid)
        .filter((id) => id !== undefined);
      if (result) {
        const follwingList = result.followings;
        const userIds = [];
        let collection = [];
        while (
          follwingList.length > 0 &&
          collection.length < LIMIT_POSTS_PER_LOADING
        ) {
          const rs = await firestore()
            .collection('posts')
            .where('userId', 'in', follwingList.splice(0, 10))
            .orderBy('create_at', 'desc')
            .limit(LIMIT_POSTS_PER_LOADING + loadedUids.length)
            .get();
          rs.docs.map((doc) => {
            if (
              loadedUids.indexOf(doc.data().uid) < 0 &&
              collection.length < LIMIT_POSTS_PER_LOADING
            ) {
              if (userIds.indexOf(doc.data().userId) < 0) {
                userIds.push(doc.data().userId);
              }
              let post = Object.assign({}, doc.data());
              doc.ref
                .collection('comments')
                .orderBy('create_at', 'desc')
                .get()
                .then((rqCmt) => {
                  post.comments = rqCmt.docs.map((docx) => docx.data());
                  if (
                    collection.length < LIMIT_POSTS_PER_LOADING &&
                    currentBlockedList.indexOf(`${post.userId}`) < 0 &&
                    blockedMeList.indexOf(`${post.userId}`) < 0
                  ) {
                    collection.push(post);
                  }
                });
            }
          });
        }
        let ownInfos = [];
        while (userIds.length > 0) {
          const usernames = userIds.splice(0, 10);
          const rs = await firestore()
            .collection('users')
            .where('username', 'in', usernames)
            .get();
          const temp = rs.docs.map((doc) => {
            return doc.data();
          });
          ownInfos = ownInfos.concat(temp);
        }
        const extraPostList = collection.map((post, index) => {
          const extraPost = Object.assign(post, {
            ownUser: ownInfos.filter((x) => x.username === post.userId)[0],
          });
          return extraPost;
        });
        console.log(extraPostList);
        dispatch(LoadMorePostListSuccess(extraPostList));
      } else {
        dispatch(LoadMorePostListFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(LoadMorePostListFailure());
    }
  };
};
export const LoadMorePostListFailure = () => {
  return {
    type: postActionTypes.LOAD_MORE_POST_LIST_FAILURE,
    payload: {
      message: 'Can not load more posts!',
    },
  };
};
export const LoadMorePostListSuccess = (payload) => {
  return {
    type: postActionTypes.LOAD_MORE_POST_LIST_SUCCESS,
    payload: payload,
  };
};
/**
 * POST COMMENTS ACTIONS
 */
export const PostCommentRequest = (postId, content, postData, setPost) => {
  return async (dispatch) => {
    try {
      const me = store.getState().user.user;
      let postList = [...store.getState().postList];
      const ref = firestore();
      const rq = await ref.collection('posts').where('uid', '==', postId).get();
      if (rq.size > 0) {
        const targetPost = rq.docs[0];
        let commentList = targetPost.data().commentList || [];
        if (
          commentList.length > 0 &&
          commentList.indexOf(me.userInfo?.username) < 0
        ) {
          commentList.push(me.userInfo?.username);
        } else {
          commentList = [me.userInfo?.username];
        }
        targetPost.ref.update({
          commentList,
        });
        const uid = new Date().getTime();
        targetPost.ref.collection('comments').doc(`${uid}`).set({
          uid: uid,
          content,
          likes: [],
          userId: me.userInfo?.username,
          create_at: new Date(),
        });
        //ADD NOTIFICATION
        if (targetPost.data().userId !== me.userInfo?.username) {
          const notificationList = targetPost.data().notificationUsers || [];
          const myIndex = notificationList.indexOf(me.userInfo?.username || '');
          if (myIndex > -1) {
            notificationList.splice(myIndex, 1);
          }
          dispatch(
            CreateNotificationRequest({
              postId,
              replyId: 0,
              commentId: uid,
              userId: notificationList,
              from: me.userInfo?.username,
              create_at: Timestamp(),
              type: notificationTypes.COMMENT_MY_POST,
            }),
          );
        }
        const rq2 = await targetPost.ref
          .collection('comments')
          .orderBy('create_at', 'desc')
          .get();
        if (postData && setPost) {
          const post = Object.assign({}, postData);
          post.comments = rq2.docs.map((x) => x.data());
          setPost(post);
        } else {
          postList = postList.map((post) => {
            if (post.uid === postId) {
              post = Object.assign({}, post);
              post.comments = rq2.docs.map((x) => x.data());
            }
            return post;
          });
          const comment = rq2.docs[0].data();
          comment.ownUser = me.userInfo;
          const payload = {
            comments: [comment],
            scrollDown: true,
          };
          dispatch(LoadMoreCommentListSuccess(payload));
          dispatch(PostCommentSuccess(postList));
        }
      } else {
        dispatch(PostCommentFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(PostCommentFailure());
    }
  };
};
export const PostCommentFailure = () => {
  return {
    type: postActionTypes.COMMENT_POST_FAILURE,
    payload: {
      message: 'Can not load more posts!',
    },
  };
};
export const PostCommentSuccess = (payload) => {
  return {
    type: postActionTypes.COMMENT_POST_SUCCESS,
    payload: payload,
  };
};
/**
 * TOGGLE LIKE POST ACTIONS
 */
export const ToggleLikePostRequest = (postId, postData, setPost) => {
  return async (dispatch) => {
    try {
      const me = store.getState().user.user;
      let postList = [...store.getState().postList];
      const ref = firestore();
      const rq = await ref.collection('posts').where('uid', '==', postId).get();
      if (rq.docs.length > 0) {
        const targetPost = rq.docs[0].data() || {};
        const index = (targetPost.likes || []).indexOf(
          me.userInfo?.username || '',
        );
        if (index > -1) {
          targetPost.likes?.splice(index, 1);
        } else {
          targetPost.likes?.push(me.userInfo?.username || '');
        }
        rq.docs[0].ref.update({
          likes: targetPost.likes,
        });
        if (postData && setPost) {
          const post = Object.assign(Object.assign({}, postData), {
            likes: targetPost.likes,
          });
          setPost(post);
        } else {
          postList = postList.map((post) => {
            if (post.uid === postId) {
              post = Object.assign(Object.assign({}, post), {
                likes: targetPost.likes,
              });
            }
            return post;
          });
          dispatch(ToggleLikePostSuccess(postList));
        }
        if (targetPost.userId !== me.userInfo?.username) {
          const notificationList = targetPost.notificationUsers || [];
          const myIndex = notificationList.indexOf(me.userInfo?.username || '');
          if (myIndex > -1) {
            notificationList.splice(myIndex, 1);
          }
          if (notificationList.length > 0) {
            if (index < 0) {
              dispatch(
                CreateNotificationRequest({
                  postId,
                  commentId: 0,
                  replyId: 0,
                  userId: notificationList,
                  from: me.userInfo?.username,
                  create_at: Timestamp(),
                  type: notificationTypes.LIKE_MY_POST,
                }),
              );
            } else {
              dispatch(
                CreateNotificationRequest({
                  isUndo: true,
                  postId,
                  commentId: 0,
                  replyId: 0,
                  userId: notificationList,
                  from: me.userInfo?.username,
                  create_at: Timestamp(),
                  type: notificationTypes.LIKE_MY_POST,
                }),
              );
            }
          }
        }
      } else {
        dispatch(ToggleLikePostFailure());
      }
    } catch (e) {
      dispatch(ToggleLikePostFailure());
    }
  };
};
export const ToggleLikePostFailure = () => {
  return {
    type: postActionTypes.TOGGLE_LIKE_POST_FAILURE,
    payload: {
      message: 'Can not load more posts!',
    },
  };
};
export const ToggleLikePostSuccess = (payload) => {
  return {
    type: postActionTypes.TOGGLE_LIKE_POST_SUCCESS,
    payload: payload,
  };
};
//CREATE POST ACTION
export const CreatePostRequest = (postData) => {
  return async (dispatch) => {
    try {
      const me = store.getState().user.user.userInfo;
      const ref = firestore();
      const rq = await ref
        .collection('users')
        .where('username', '==', me?.username)
        .get();
      const uid = new Date().getTime();
      //Regex Hashtags
      // eslint-disable-next-line no-useless-escape
      const regex = /\#\w+/gm;
      const str = postData.content || '';
      let m;
      let hashTagList = [];
      while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        m.forEach((match, groupIndex) => {
          hashTagList.push(match);
        });
      }
      hashTagList = Array.from(new Set(hashTagList));
      postData.hashtags = [...hashTagList];
      if (rq.size > 0) {
        const labels = await Promise.all(
          postData.source?.map(async (img) => {
            return await getImageClass(img.uri);
          }) || [],
        );
        ref
          .collection('posts')
          .doc(`${uid}`)
          .set(Object.assign(Object.assign({}, postData), {uid, labels}));
        dispatch(FetchPostListRequest());
        hashTagList.map(async (hashtag) => {
          const rqh = await ref
            .collection('hashtags')
            .where('name', '==', hashtag)
            .get();
          if (rqh.size > 0) {
            const targetHashtag = rqh.docs[0];
            const data = targetHashtag.data() || {};
            const sources = data.sources || [];
            sources.push(uid);
            targetHashtag.ref.update({
              sources,
            });
          } else {
            const keyword = generateUsernameKeywords(hashtag);
            keyword.splice(0, 1);
            const fetchRelatedTags = keyword.map(async (character) => {
              const rqr = await ref
                .collection('hashtags')
                .where('keyword', 'array-contains', character)
                .get();
              const data = rqr.docs.map((x) => x.data() || {});
              return data.map((x) => x.name || '');
            });
            Promise.all(fetchRelatedTags).then((rs) => {
              let relatedTags = [];
              rs.map((lv1) => {
                lv1.map((x) => relatedTags.push(x));
              });
              relatedTags = Array.from(new Set(relatedTags));
              relatedTags.map(async (tag) => {
                const rqt = await ref
                  .collection('hashtags')
                  .doc(`${tag}`)
                  .get();
                if (rqt.exists) {
                  const currentRelatedTags =
                    (rqt.data() || {}).relatedTags || [];
                  currentRelatedTags.push(hashtag);
                  rqt.ref.update({
                    relatedTags: currentRelatedTags,
                  });
                }
              });
              const hashtagUid = new Date().getTime();
              ref
                .collection('hashtags')
                .doc(hashtag)
                .set({
                  name: hashtag,
                  followers: [],
                  keyword,
                  relatedTags,
                  sources: [uid],
                  uid: hashtagUid,
                });
            });
          }
        });
      } else {
        dispatch(CreatePostFailure());
      }
    } catch (e) {
      dispatch(CreatePostFailure());
    }
  };
};
export const CreatePostFailure = () => {
  return {
    type: postActionTypes.CREATE_POST_FAILURE,
    payload: {
      message: 'Can not post this post!',
    },
  };
};
// export const CreatePostSuccess = (payload: PostList): PostSuccessAction<PostList> => {
//     return {
//         type: postActionTypes.CREATE_POST_SUCCESS,
//         payload: payload
//     }
// }
//UPDATE POST ACTION
export const UpdatePostRequest = (uid, updatedData) => {
  return async (dispatch) => {
    try {
      const me = store.getState().user.user.userInfo;
      let postList = [...store.getState().postList];
      const ref = firestore();
      const rq = await ref
        .collection('users')
        .where('username', '==', me?.username)
        .get();
      const rq2 = await ref.collection('posts').doc(`${uid}`).get();
      const posts = postList.filter((p) => p.uid === uid);
      if (rq.size > 0 && rq2.exists && posts.length > 0) {
        let onlinePost = rq2.data() || {};
        const targetPost = Object.assign({}, posts[0]);
        rq2.ref
          .update(Object.assign(Object.assign({}, onlinePost), updatedData))
          .then(() => {
            dispatch(
              UpdatePostSuccess(
                Object.assign(
                  Object.assign({ownUser: targetPost.ownUser}, onlinePost),
                  updatedData,
                ),
              ),
            );
          })
          .catch((err) => {
            console.log(err);
            dispatch(UpdatePostFailure());
          });
      } else {
        dispatch(UpdatePostFailure());
      }
    } catch (e) {
      dispatch(UpdatePostFailure());
    }
  };
};
export const UpdatePostFailure = () => {
  return {
    type: postActionTypes.UPDATE_POST_FAILURE,
    payload: {
      message: 'Can not update post now!',
    },
  };
};
export const UpdatePostSuccess = (payload) => {
  return {
    type: postActionTypes.UPDATE_POST_SUCCESS,
    payload: payload,
  };
};
