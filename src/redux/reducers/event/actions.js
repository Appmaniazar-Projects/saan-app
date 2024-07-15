// import {firestore} from 'firebase';
import firestore from '@react-native-firebase/firestore';
import {
  eventActionTypes,
  LIMIT_OPPORTUNITY_PER_LOADING,
  NOTICE_BOARD_LIMIT,
  LIMIT_EVENT_COMMENTS_PER_LOADING,
} from './types';
// import {LIMIT_POSTS_PER_LOADING, postActionTypes} from '../post/types';
import storage from '@react-native-firebase/storage';
import {store} from '../../store/configureStore';
import _ from 'lodash';
import moment from 'moment';
// import {
//   generateUsernameKeywords,
//   Timestamp,
//   getImageClass,
// } from '../../../utils';

export const FetchNoticeBoardRequest = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: eventActionTypes.FETCH_NOTICE_BOARD_REQUEST,
      });
      let result = {
        events: [],
        opportunities: [],
      };
      const eResult = await firestore()
        .collection('event')
        .orderBy('create_time', 'desc')
        .limit(NOTICE_BOARD_LIMIT)
        .get();
      const oResult = await firestore()
        .collection('opportunities')
        .orderBy('create_time', 'desc')
        .limit(NOTICE_BOARD_LIMIT)
        .get();
      if (eResult && _.isArray(eResult.docs)) {
        const temp = eResult.docs.map((doc) => {
          return doc.data();
        });
        result.events = temp;
      }

      if (oResult && _.isArray(oResult.docs)) {
        const temp = oResult.docs.map((doc) => {
          return doc.data();
        });
        result.opportunities = temp;
      }

      console.log(result);
      dispatch(FetchNoticeBoardSuccess(result));
    } catch (e) {
      console.log(e);
      dispatch(FetchNoticeBoardFailure());
    }
  };
};
export const FetchNoticeBoardFailure = () => {
  return {
    type: eventActionTypes.FETCH_NOTICE_BOARD_FAILURE,
    payload: {
      message: 'Get board data Failed!',
    },
  };
};
export const FetchNoticeBoardSuccess = (payload) => {
  return {
    type: eventActionTypes.FETCH_NOTICE_BOARD_SUCCESS,
    payload: payload,
  };
};

export const FetchOpportunitiesRequest = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: eventActionTypes.FETCH_OPPORTUNITY_REQUEST,
      });
      let result = [];
      const oResult = await firestore()
        .collection('opportunities')
        .orderBy('create_time', 'desc')
        .limit(LIMIT_OPPORTUNITY_PER_LOADING)
        .get();

      if (oResult && _.isArray(oResult.docs)) {
        const temp = oResult.docs.map((doc) => {
          // return doc.data();
          return {
            uid: doc.ref.id,
            ...doc.data(),
          };
        });
        result = temp;
      }

      console.log(result);
      dispatch(FetchOpportunitiesSuccess(result));
    } catch (e) {
      console.log(e);
      dispatch(FetchOpportunitiesFailure());
    }
  };
};

export const FetchOpportunitiesFailure = () => {
  return {
    type: eventActionTypes.FETCH_OPPORTUNITY_FAILURE,
    payload: {
      message: 'Get board data Failed!',
    },
  };
};
export const FetchOpportunitiesSuccess = (payload) => {
  return {
    type: eventActionTypes.FETCH_OPPORTUNITY_SUCCESS,
    payload: payload,
  };
};

export const LoadMoreOpportunityRequest = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: eventActionTypes.LOAD_MORE_OPPORTUNITY_REQUEST,
      });
      let result = [];
      const loadedUids = store.getState().event.opportunity;
      console.log('LoadMoreOpportunityRequest', _.last(loadedUids));
      const oResult = await firestore()
        .collection('opportunities')
        .orderBy('create_time', 'desc')
        .startAfter(_.last(loadedUids).create_time)
        .limit(LIMIT_OPPORTUNITY_PER_LOADING)
        .get();

      if (oResult && _.isArray(oResult.docs)) {
        const temp = oResult.docs.map((doc) => {
          // return doc.data();
          return {
            uid: doc.ref.id,
            ...doc.data(),
          };
        });
        result = temp;
      }

      console.log(result);
      dispatch(LoadMoreOpportunitiesSuccess(result));
    } catch (e) {
      console.log(e);
      dispatch(LoadMoreOpportunitiesFailure());
    }
  };
};

export const LoadMoreOpportunitiesFailure = () => {
  return {
    type: eventActionTypes.LOAD_MORE_OPPORTUNITY_FAILURE,
    payload: {
      message: 'Get board data Failed!',
    },
  };
};
export const LoadMoreOpportunitiesSuccess = (payload) => {
  return {
    type: eventActionTypes.LOAD_MORE_OPPORTUNITY_SUCCESS,
    payload: payload,
  };
};

export const FetchEventsRequest = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: eventActionTypes.FETCH_EVENT_REQUEST,
      });
      let result = [];
      const oResult = await firestore()
        .collection('event')
        // .orderBy('create_at', 'desc')
        .orderBy('create_time', 'desc')
        // .limit(LIMIT_OPPORTUNITY_PER_LOADING)
        .get();

      if (oResult && _.isArray(oResult.docs)) {
        const temp = oResult.docs.map((doc) => {
          return doc.data();
        });
        result = temp;
      }

      console.log(result);
      dispatch(FetchEventSuccess(result));
    } catch (e) {
      console.log(e);
      dispatch(FetchEventFailure());
    }
  };
};

export const FetchEventFailure = () => {
  return {
    type: eventActionTypes.FETCH_EVENT_FAILURE,
    payload: {
      message: 'Get board data Failed!',
    },
  };
};
export const FetchEventSuccess = (payload) => {
  return {
    type: eventActionTypes.FETCH_EVENT_SUCCESS,
    payload: payload,
  };
};

export const CreateEventRequest = (data) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: eventActionTypes.CEREATE_EVENT_REQUEST,
      });
      // let result = [];
      // const uid =
      const img = data.tempImage;
      const extension = img.path.split('.').pop()?.toLocaleLowerCase();
      const rq = await storage()
        .ref(`events/${new Date().getTime() + Math.random()}.${extension}`)
        .putFile(img.path);
      const downloadUri = await storage()
        .ref(rq.metadata.fullPath)
        .getDownloadURL();
      const uid = new Date().getTime();
      const newEvent = {
        content: data.content,
        created_at: moment().format('DD/MM/YYYY[,] HH:mm:ss A'),
        date: moment(data.date).format('YYYY-MM-DD'),
        image: downloadUri,
        place: data.place,
        title: data.title,
        create_time: firestore.Timestamp.fromDate(new Date()).toDate(),
        start_time: moment(data.start_time).format('hh:mm A'),
        end_time: moment(data.end_time).format('hh:mm A'),
        uid,
      };
      const oResult = await firestore()
        .collection('event')
        .doc(`${uid}`)
        .set(newEvent);

      // if (oResult && _.isArray(oResult.docs)) {
      //   const temp = oResult.docs.map((doc) => {
      //     return doc.data();
      //   });
      //   result = temp;
      // }

      console.log(oResult);
      dispatch(CreateEventSuccess());
    } catch (e) {
      console.log(e);
      dispatch(CreateEventFailure());
    }
  };
};

export const CreateEventFailure = () => {
  return {
    type: eventActionTypes.FETCH_EVENT_FAILURE,
    payload: {
      message: 'Get board data Failed!',
    },
  };
};
export const CreateEventSuccess = (payload) => {
  return {
    type: eventActionTypes.FETCH_EVENT_SUCCESS,
    payload: payload,
  };
};

// create event comment

/**
 * POST COMMENTS ACTIONS
 */
export const EventCommentRequest = (eventId, content, postData, setPost) => {
  return async (dispatch) => {
    try {
      const me = store.getState().user.user;
      let eventList = [...store.getState().event.events];
      const ref = firestore();
      const rq = await ref
        .collection('event')
        .where('uid', '==', eventId)
        .get();
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
        // if (targetPost.data().userId !== me.userInfo?.username) {
        //   const notificationList = targetPost.data().notificationUsers || [];
        //   const myIndex = notificationList.indexOf(me.userInfo?.username || '');
        //   if (myIndex > -1) {
        //     notificationList.splice(myIndex, 1);
        //   }
        //   dispatch(
        //     CreateNotificationRequest({
        //       postId,
        //       replyId: 0,
        //       commentId: uid,
        //       userId: notificationList,
        //       from: me.userInfo?.username,
        //       create_at: Timestamp(),
        //       type: notificationTypes.COMMENT_MY_POST,
        //     }),
        //   );
        // }
        const rq2 = await targetPost.ref
          .collection('comments')
          .orderBy('create_at', 'desc')
          .get();
        // if (postData && setPost) {
        //   const post = Object.assign({}, postData);
        //   post.comments = rq2.docs.map((x) => x.data());
        //   setPost(post);
        // } else {
        eventList = eventList.map((event) => {
          if (event.uid === eventId) {
            event = Object.assign({}, event);
            event.comments = rq2.docs.map((x) => x.data());
          }
          return event;
        });
        const comment = rq2.docs[0].data();
        comment.ownUser = me.userInfo;
        const payload = {
          comments: [comment],
          scrollDown: true,
        };
        dispatch(LoadMoreEventCommentListSuccess(payload));
        dispatch(EventCommentSuccess(eventList));
        // }
      } else {
        dispatch(EventCommentFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(EventCommentFailure());
    }
  };
};
export const EventCommentFailure = () => {
  return {
    type: eventActionTypes.EVENT_COMMENT_POST_FAILURE,
    payload: {
      message: 'Can not load more posts!',
    },
  };
};
export const EventCommentSuccess = (payload) => {
  return {
    type: eventActionTypes.EVENT_COMMENT_POST_SUCCESS,
    payload: payload,
  };
};

// fetch event comment
export const FetchEventCommentListRequest = (eventId, postData) => {
  return async (dispatch) => {
    try {
      const ref = firestore();
      const rq = await ref
        .collection('event')
        .where('uid', '==', eventId)
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
          collection.length < LIMIT_EVENT_COMMENTS_PER_LOADING &&
          collection.length < rqAll.size
        ) {
          const rq2 = await targetPost.ref
            .collection('comments')
            .orderBy('create_at', 'asc')
            .limit(LIMIT_EVENT_COMMENTS_PER_LOADING - collection.length)
            .get();
          i += LIMIT_EVENT_COMMENTS_PER_LOADING - collection.length;
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
          dispatch(FetchEventCommentListSuccess(payload));
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
          dispatch(FetchEventCommentListSuccess(payload));
        }
      } else {
        dispatch(FetchEventCommentListFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(FetchEventCommentListFailure());
    }
  };
};
export const FetchEventCommentListFailure = () => {
  return {
    type: eventActionTypes.FETCH_EVENT_COMMENTS_FAILURE,
    payload: {
      message: 'Get Comments Failed!',
    },
  };
};
export const FetchEventCommentListSuccess = (payload) => {
  return {
    type: eventActionTypes.FETCH_EVENT_COMMENTS_SUCCESS,
    payload: payload,
  };
};
// load more event comment

export const LoadMoreEventCommentListRequest = (eventId) => {
  return async (dispatch) => {
    try {
      const loadedCommentIds = store
        .getState()
        .event.eventComments.map((x) => x.uid);
      const ref = firestore();
      const rq = await ref
        .collection('event')
        .where('uid', '==', eventId)
        .limit(1)
        .get();
      if (rq.docs.length > 0) {
        const targetPost = rq.docs[0];
        const ownIds = [];
        let collection = [];
        const rqAll = await targetPost.ref.collection('comments').get();
        while (
          collection.length < LIMIT_EVENT_COMMENTS_PER_LOADING &&
          loadedCommentIds.length + collection.length < rqAll.size
        ) {
          const rq2 = await targetPost.ref
            .collection('comments')
            .orderBy('create_at', 'asc')
            .limit(LIMIT_EVENT_COMMENTS_PER_LOADING + loadedCommentIds.length)
            .get();
          rq2.docs.map((x) => {
            if (
              loadedCommentIds.indexOf(x.data().uid) < 0 &&
              collection.length < LIMIT_EVENT_COMMENTS_PER_LOADING
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
        dispatch(LoadMoreEventCommentListSuccess(payload));
      } else {
        dispatch(LoadMoreEventCommentListFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(LoadMoreEventCommentListFailure());
    }
  };
};
export const ResetCommentList = () => {
  return {
    type: eventActionTypes.FETCH_COMMENTS_REQUEST,
  };
};
export const LoadMoreEventCommentListFailure = () => {
  return {
    type: eventActionTypes.LOAD_MORE_EVENT_COMMENTS_FAILURE,
    payload: {
      message: 'Get Comments Failed!',
    },
  };
};
export const LoadMoreEventCommentListSuccess = (payload) => {
  return {
    type: eventActionTypes.LOAD_MORE_EVENT_COMMENTS_SUCCESS,
    payload: payload,
  };
};
