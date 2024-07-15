// import {firestore} from 'firebase';
import firestore from '@react-native-firebase/firestore';
import {commentActionTypes, LIMIT_COMMENTS_PER_LOADING} from './types';
import {store} from '../../store/configureStore';
import {CreateNotificationRequest} from '../notification/actions';
import {Timestamp} from '../../../utils';
import {notificationTypes} from '../notification/types';
export const FetchCommentListRequest = (postId, postData) => {
  return async (dispatch) => {
    try {
      const ref = firestore();
      const rq = await ref
        .collection('posts')
        .where('uid', '==', postId)
        .limit(1)
        .get();
      if (rq.docs.length > 0) {
        const targetPost = rq.docs[0];
        const ownIds = [];
        let collection = [];
        const rqAll = await targetPost.ref.collection('comments').get();
        // eslint-disable-next-line no-unused-vars
        let i = 0;
        while (
          collection.length < LIMIT_COMMENTS_PER_LOADING &&
          collection.length < rqAll.size
        ) {
          const rq2 = await targetPost.ref
            .collection('comments')
            .orderBy('create_at', 'asc')
            .limit(LIMIT_COMMENTS_PER_LOADING - collection.length)
            .get();
          i += LIMIT_COMMENTS_PER_LOADING - collection.length;
          rq2.docs.map((x) => {
            const data = Object.assign({}, x.data());
            x.ref
              .collection('replies')
              .orderBy('create_at', 'asc')
              .get()
              .then((rq3) => {
                let replies = rq3.docs.map((x2) => {
                  if (ownIds.indexOf(x2.data().userId) < 0) {
                    ownIds.push(x2.data().userId);
                  }
                  return x2.data();
                });
                data.replies = replies;
              });
            if (ownIds.indexOf(x.data().userId) < 0) {
              ownIds.push(x.data().userId);
            }
            collection.push(data);
          });
        }
        let ownInfos = [];
        while (ownIds.length > 0) {
          const rs = await firestore()
            .collection('users')
            .where('username', 'in', ownIds.splice(0, 10))
            .get();
          const temp = rs.docs.map((doc) => {
            return doc.data();
          });
          ownInfos = ownInfos.concat(temp);
        }
        collection = collection.map((comment) => {
          // var _a;
          comment.ownUser = ownInfos.filter(
            (x) => x.username === comment.userId,
          )[0];
          comment.replies = comment.replies?.map((x) => {
            x.ownUser = ownInfos.filter((x2) => x2.username === x.userId)[0];
            return x;
          });
          return comment;
        });
        if (postData) {
          const payload = {
            post: Object.assign({}, postData),
            comments: collection,
          };
          dispatch(FetchCommentListSuccess(payload));
        } else {
          let ownUser = store
            .getState()
            .postList.filter((x) => x.uid === targetPost.data().uid);
          const info = ownUser.length > 0 ? ownUser[0].ownUser || {} : {};
          const post = Object.assign(Object.assign({}, targetPost.data()), {
            ownUser: info,
          });
          const payload = {
            post,
            comments: collection,
          };
          dispatch(FetchCommentListSuccess(payload));
        }
      } else {
        dispatch(FetchCommentListFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(FetchCommentListFailure());
    }
  };
};
export const FetchCommentListFailure = () => {
  return {
    type: commentActionTypes.FETCH_COMMENTS_FAILURE,
    payload: {
      message: 'Get Comments Failed!',
    },
  };
};
export const FetchCommentListSuccess = (payload) => {
  return {
    type: commentActionTypes.FETCH_COMMENTS_SUCCESS,
    payload: payload,
  };
};
/**
 * LOAD MORE COMMENTS ACTIONS
 */
export const LoadMoreCommentListRequest = (postId) => {
  return async (dispatch) => {
    try {
      const loadedCommentIds = store
        .getState()
        .comment.comments.map((x) => x.uid);
      const ref = firestore();
      const rq = await ref
        .collection('posts')
        .where('uid', '==', postId)
        .limit(1)
        .get();
      if (rq.docs.length > 0) {
        const targetPost = rq.docs[0];
        const ownIds = [];
        let collection = [];
        const rqAll = await targetPost.ref.collection('comments').get();
        while (
          collection.length < LIMIT_COMMENTS_PER_LOADING &&
          loadedCommentIds.length + collection.length < rqAll.size
        ) {
          const rq2 = await targetPost.ref
            .collection('comments')
            .orderBy('create_at', 'asc')
            .limit(LIMIT_COMMENTS_PER_LOADING + loadedCommentIds.length)
            .get();
          rq2.docs.map((x) => {
            if (
              loadedCommentIds.indexOf(x.data().uid) < 0 &&
              collection.length < LIMIT_COMMENTS_PER_LOADING
            ) {
              const data = Object.assign({}, x.data());
              // x.ref.collection('replies')
              //     .orderBy('create_at', 'asc').get().then(rq3 => {
              //         let replies = rq3.docs.map(x2 => {
              //             if (ownIds.indexOf(x2.data().userId) < 0)
              //                 ownIds.push(x2.data().userId)
              //             return x2.data()
              //         })
              //         data.replies = replies
              //     })
              if (ownIds.indexOf(x.data().userId) < 0) {
                ownIds.push(x.data().userId);
              }
              collection.push(data);
            }
          });
        }
        let ownInfos = [];
        while (ownIds.length > 0) {
          const rs = await firestore()
            .collection('users')
            .where('username', 'in', ownIds.splice(0, 10))
            .get();
          const temp = rs.docs.map((doc) => {
            return doc.data();
          });
          ownInfos = ownInfos.concat(temp);
        }
        collection = collection.map((comment) => {
          // var _a;
          comment.ownUser = ownInfos.filter(
            (x) => x.username === comment.userId,
          )[0];
          comment.replies = comment.replies?.map((x) => {
            x.ownUser = ownInfos.filter((x2) => x2.username === x.userId)[0];
            return x;
          });
          return comment;
        });
        const payload = {
          comments: collection,
          scrollDown: false,
        };
        dispatch(LoadMoreCommentListSuccess(payload));
      } else {
        dispatch(LoadMoreCommentListFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(LoadMoreCommentListFailure());
    }
  };
};
export const ResetCommentList = () => {
  return {
    type: commentActionTypes.FETCH_COMMENTS_REQUEST,
  };
};
export const LoadMoreCommentListFailure = () => {
  return {
    type: commentActionTypes.LOAD_MORE_COMMENTS_FAILURE,
    payload: {
      message: 'Get Comments Failed!',
    },
  };
};
export const LoadMoreCommentListSuccess = (payload) => {
  return {
    type: commentActionTypes.LOAD_MORE_COMMENTS_SUCCESS,
    payload: payload,
  };
};
/**
 * TOGGLE LIKE REPLY ACTION
 */
export const ToggleLikeCommentRequest = (postId, commentId) => {
  return async (dispatch) => {
    try {
      const me = store.getState().user.user.userInfo;
      let commentList = [...store.getState().comment.comments];
      const ref = firestore();
      if (me?.username) {
        const username = me.username;
        const rq = await ref
          .collectionGroup('comments')
          .where('uid', '==', commentId)
          .limit(1)
          .get();
        const rq2 = await ref.collection('posts').doc(`${postId}`).get();
        if (rq.size > 0) {
          const targetPost = rq2.data() || {};
          const targetComment = rq.docs[0];
          const comment = targetComment.data();
          const likes = comment.likes || [];
          const index = likes.indexOf(username);
          if (index < 0) {
            likes.push(username);
          } else {
            likes.splice(index, 1);
          }
          await targetComment.ref.update({
            likes: likes,
          });
          //add notification
          if (targetComment.data().userId !== me?.username) {
            let notificationList = targetPost.notificationUsers || [];
            notificationList.push(targetComment.data().userId);
            const myIndex = notificationList.indexOf(me?.username || '');
            if (myIndex > -1) {
              notificationList.splice(myIndex, 1);
            }
            notificationList = Array.from(new Set(notificationList));
            if (notificationList.length > 0) {
              if (index < 0) {
                dispatch(
                  CreateNotificationRequest({
                    postId,
                    replyId: 0,
                    commentId: commentId,
                    userId: notificationList,
                    from: username,
                    create_at: Timestamp(),
                    type: notificationTypes.LIKE_MY_COMMENT,
                  }),
                );
              } else {
                dispatch(
                  CreateNotificationRequest({
                    isUndo: true,
                    postId,
                    replyId: 0,
                    commentId: commentId,
                    userId: notificationList,
                    from: username,
                    create_at: Timestamp(),
                    type: notificationTypes.LIKE_MY_COMMENT,
                  }),
                );
              }
            }
          }
          commentList = commentList.map((xComment) => {
            if (xComment.uid === comment.uid) {
              const newComment = Object.assign({}, xComment);
              newComment.likes = likes;
              return newComment;
            }
            return xComment;
          });
          const payload = {
            comments: commentList,
            scrollDown: false,
          };
          dispatch(ToggleLikeCommentSuccess(payload));
        } else {
          dispatch(ToggleLikeCommentFailure());
        }
      } else {
        dispatch(ToggleLikeCommentFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(ToggleLikeCommentFailure());
    }
  };
};
export const ToggleLikeCommentFailure = () => {
  return {
    type: commentActionTypes.TOGGLE_LIKE_COMMENT_FAILURE,
    payload: {
      message: 'Get Comments Failed!',
    },
  };
};
export const ToggleLikeCommentSuccess = (payload) => {
  return {
    type: commentActionTypes.TOGGLE_LIKE_COMMENT_SUCCESS,
    payload: payload,
  };
};
/**
 * TOGGLE LIKE COMMMENT ACTION
 */
export const ToggleLikeReplyRequest = (replyId, commentId, postId) => {
  return async (dispatch) => {
    try {
      const me = store.getState().user.user.userInfo;
      let commentList = [...store.getState().comment.comments];
      const ref = firestore();
      if (me?.username) {
        const username = me.username;
        const rq = await ref
          .collectionGroup('replies')
          .where('uid', '==', replyId)
          .limit(1)
          .get();
        if (rq.size > 0) {
          const targetReply = rq.docs[0];
          const reply = targetReply.data();
          if (reply.likes) {
            const index = reply.likes.indexOf(username);
            if (index < 0) {
              reply.likes.push(username);
            } else {
              reply.likes.splice(index, 1);
            }
            await targetReply.ref.update({
              likes: reply.likes,
            });
            if (targetReply.data().userId !== me?.username) {
              if (index < 0) {
                dispatch(
                  CreateNotificationRequest({
                    postId,
                    replyId,
                    commentId,
                    userId: [targetReply.data().userId],
                    from: username,
                    create_at: Timestamp(),
                    type: notificationTypes.LIKE_MY_REPLY,
                  }),
                );
              } else {
                dispatch(
                  CreateNotificationRequest({
                    isUndo: true,
                    postId,
                    replyId,
                    commentId,
                    userId: [targetReply.data().userId],
                    from: username,
                    create_at: Timestamp(),
                    type: notificationTypes.LIKE_MY_REPLY,
                  }),
                );
              }
            }
            commentList = commentList.map((xComment) => {
              // var _a;
              if (xComment.uid === commentId) {
                const newComment = Object.assign({}, xComment);
                newComment.replies =
                  xComment.replies?.map((xReply) => {
                    xReply = Object.assign({}, xReply);
                    if (xReply.uid === reply.uid) {
                      xReply.likes = reply.likes;
                    }
                    return xReply;
                  }) || [];
                return newComment;
              }
              return xComment;
            });
            const payload = {
              comments: commentList,
              scrollDown: false,
            };
            dispatch(ToggleLikeReplySuccess(payload));
          }
        } else {
          dispatch(ToggleLikeReplyFailure());
        }
      } else {
        dispatch(ToggleLikeReplyFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(ToggleLikeReplyFailure());
    }
  };
};
export const ToggleLikeReplyFailure = () => {
  return {
    type: commentActionTypes.TOGGLE_LIKE_COMMENT_FAILURE,
    payload: {
      message: 'Get Comments Failed!',
    },
  };
};
export const ToggleLikeReplySuccess = (payload) => {
  return {
    type: commentActionTypes.TOGGLE_LIKE_COMMENT_SUCCESS,
    payload: payload,
  };
};
/**
 * POST REPLY ACTIONS
 */
export const PostReplyRequest = (postId, commentId, content) => {
  return async (dispatch) => {
    // var _a, _b, _c, _d;
    try {
      const me = store.getState().user.user;
      let comments = [...store.getState().comment.comments];
      const ref = firestore();
      const rq = await ref
        .collectionGroup('comments')
        .where('uid', '==', commentId)
        .limit(1)
        .get();
      const rqTemp = await ref.collection('posts').doc(`${postId}`).get();
      const targetPost = rqTemp.data() || {};
      if (rq.size > 0) {
        const targetComment = rq.docs[0];
        const replyUid = new Date().getTime();
        await targetComment.ref.collection('replies').doc(`${replyUid}`).set({
          content,
          create_at: new Date(),
          likes: [],
          uid: replyUid,
          userId: me.userInfo?.username,
        });
        const rq2 = await ref
          .collectionGroup('replies')
          .where('uid', '==', replyUid)
          .limit(1)
          .get();
        //ADD NOTIFICATION
        const targetCommentUsername = targetComment.data().userId;
        if (
          targetPost.userId !== me.userInfo?.username &&
          targetCommentUsername !== me.userInfo?.username
        ) {
          dispatch(
            CreateNotificationRequest({
              postId,
              commentId: commentId,
              replyId: replyUid,
              userId: [targetCommentUsername],
              from: me.userInfo?.username,
              create_at: Timestamp(),
              type: notificationTypes.REPLY_MY_COMMENT,
            }),
          );
        }
        comments = comments.map((comment) => {
          // var _a;
          if (comment.uid === commentId) {
            comment = Object.assign({}, comment);
            const reply = rq2.docs[0].data();
            reply.ownUser = me.userInfo;
            if (comment?.replies === undefined) {
              comment.replies = [];
            }
            comment?.replies.push(reply);
          }
          return comment;
        });
        dispatch(
          PostReplySuccess({
            comments: comments,
            scrollDown: false,
          }),
        );
      } else {
        dispatch(PostReplyFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(PostReplyFailure());
    }
  };
};
export const PostReplyFailure = () => {
  return {
    type: commentActionTypes.REPLY_COMMENT_FAILURE,
    payload: {
      message: 'Can not load more posts!',
    },
  };
};
export const PostReplySuccess = (payload) => {
  return {
    type: commentActionTypes.REPLY_COMMENT_SUCCESS,
    payload: payload,
  };
};
