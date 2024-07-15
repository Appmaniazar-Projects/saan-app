// import {firestore, database} from 'firebase';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {seenTypes, messagesActionTypes} from './types';
// import {UserInfo} from '../reducers/userReducer';
import {store} from '../../store/configureStore';
// import {Post, ExtraPost} from '../reducers/postReducer';
// import {Comment} from '../reducers/commentReducer';
import {
  convertToFirebaseDatabasePathName,
  revertFirebaseDatabasePathName,
} from '../../../utils';
let allowListenChildAdd = false;
export const TriggerMessageListenerRequest = () => {
  return async (dispatch) => {
    // console.log('allowListenChildAdd', allowListenChildAdd);
    try {
      const dbRef = database();
      const ref = firestore();
      const myUsername = store.getState().user.user.userInfo?.username || '';
      const myUsernamePath = convertToFirebaseDatabasePathName(myUsername);
      dbRef.ref(`/messages/${myUsernamePath}/`).once('value', async (snap) => {
        const messageCollection = [];
        const userIds = [];
        snap.forEach((targetUser) => {
          if (targetUser.key !== 'forceUpdate') {
            const userId = revertFirebaseDatabasePathName(`${targetUser.key}`);
            if (userIds.indexOf(`${targetUser.key}`) < 0) {
              userIds.push(userId);
            }
            const messages = [];
            if (snap.val() !== 'NULL') {
              targetUser.forEach((m) => {
                messages.push(
                  Object.assign(Object.assign({}, m.val()), {userId}),
                );
              });
            }
            messageCollection.push(messages);
          }
        });

        // listen new conversation change =
        dbRef.ref(`/messages/${myUsernamePath}/`).off();
        // dbRef.ref(`/messages/${myUsernamePath}/`).on('child_added', () => {
        //   console.log('child_added');
        //   dispatch(TriggerMessageListenerRequest());
        // });
        // dbRef.ref(`/messages/${myUsernamePath}/`).on('child_moved', () => {
        //   console.log('child_moved');
        //   dispatch(TriggerMessageListenerRequest());
        // });
        dbRef.ref(`/messages/${myUsernamePath}/`).on('child_removed', () => {
          console.log('child_removed');
          dispatch(TriggerMessageListenerRequest());
        });
        //Listen Change
        userIds.map((userId) => {
          //refresh listener
          dbRef
            .ref(
              `/messages/${myUsernamePath}/${convertToFirebaseDatabasePathName(
                userId,
              )}`,
            )
            .off('child_added');
          dbRef
            .ref(
              `/messages/${myUsernamePath}/${convertToFirebaseDatabasePathName(
                userId,
              )}`,
            )
            .off('child_changed');
          dbRef
            .ref(
              `/messages/${convertToFirebaseDatabasePathName(
                userId,
              )}/${myUsernamePath}`,
            )
            .off('child_added');
          dbRef
            .ref(
              `/messages/${convertToFirebaseDatabasePathName(
                userId,
              )}/${myUsernamePath}`,
            )
            .off('child_changed');
          dbRef
            .ref(
              `/messages/${myUsernamePath}/${convertToFirebaseDatabasePathName(
                userId,
              )}`,
            )
            .on('child_changed', async (snap) => {
              // console.log('allowListenChildAdd80', allowListenChildAdd);
              const child = snap.val();
              const uid = child.uid;
              const realUsername = revertFirebaseDatabasePathName(userId);
              const extraMsgIndex = store
                .getState()
                .messages.findIndex((x) => x.ownUser.username === realUsername);
              if (extraMsgIndex > -1) {
                const extraMsg = store.getState().messages[extraMsgIndex];
                const msgIndex = extraMsg.messageList.findIndex(
                  (x) => x.uid === uid,
                );
                if (msgIndex > -1) {
                  extraMsg.messageList[msgIndex] = Object.assign(
                    Object.assign({}, child),
                    {userId},
                  );
                  const extraMsgList = [...store.getState().messages];
                  extraMsgList[extraMsgIndex] = Object.assign({}, extraMsg);
                  dispatch(TriggerMessageListenerSuccess(extraMsgList));
                }
              }
            });
          dbRef
            .ref(
              `/messages/${convertToFirebaseDatabasePathName(
                userId,
              )}/${myUsernamePath}`,
            )
            .on('child_changed', async (snap) => {
              // console.log('allowListenChildAdd109', allowListenChildAdd);
              const child = snap.val();
              const uid = child.uid;
              const realUsername = revertFirebaseDatabasePathName(userId);
              const extraMsgIndex = store
                .getState()
                .messages.findIndex((x) => x.ownUser.username === realUsername);
              if (extraMsgIndex > -1) {
                const extraMsg = store.getState().messages[extraMsgIndex];
                const msgIndex = extraMsg.messageList.findIndex(
                  (x) => x.uid === uid,
                );
                if (msgIndex > -1) {
                  extraMsg.messageList[msgIndex] = Object.assign(
                    Object.assign({}, child),
                    {userId: myUsername},
                  );
                  const extraMsgList = [...store.getState().messages];
                  extraMsgList[extraMsgIndex] = Object.assign({}, extraMsg);
                  dispatch(TriggerMessageListenerSuccess(extraMsgList));
                }
              }
            });
          dbRef
            .ref(
              `/messages/${myUsernamePath}/${convertToFirebaseDatabasePathName(
                userId,
              )}`,
            )
            .on('child_added', async (snap) => {
              // console.log('allowListenChildAdd', allowListenChildAdd);
              if (allowListenChildAdd) {
                const child = snap.val();
                const msg = Object.assign(Object.assign({}, child), {userId});
                const extraMsgList = [...store.getState().messages];
                const extraMsgIndex = extraMsgList.findIndex(
                  (x) => x.ownUser.username === userId,
                );
                if (extraMsgIndex > -1) {
                  const extraMsg = extraMsgList[extraMsgIndex];
                  extraMsg.messageList = [msg, ...extraMsg.messageList];
                  extraMsgList[extraMsgIndex] = Object.assign({}, extraMsg);
                } else {
                  const rq = await firestore()
                    .collection('users')
                    .doc(`${userId}`)
                    .get();
                  const userData = rq.data() || {};
                  dbRef.ref(`/online/${snap.key}`).once('value', (snap2) => {
                    const extraMsg = {
                      ownUser: userData,
                      messageList: [msg],
                      online: snap2.val(),
                    };
                    const newExtraMsgList = [extraMsg, ...extraMsgList];
                    newExtraMsgList.sort(
                      (a, b) =>
                        (b.messageList.length > 0
                          ? b.messageList[0].create_at
                          : 0) -
                        (a.messageList.length > 0
                          ? a.messageList[0].create_at
                          : 0),
                    );
                    return dispatch(
                      TriggerMessageListenerSuccess(newExtraMsgList),
                    );
                  });
                }
                extraMsgList.sort(
                  (a, b) =>
                    (b.messageList.length > 0
                      ? b.messageList[0].create_at
                      : 0) -
                    (a.messageList.length > 0 ? a.messageList[0].create_at : 0),
                );
                dispatch(TriggerMessageListenerSuccess(extraMsgList));
              }
            });
          dbRef
            .ref(
              `/messages/${convertToFirebaseDatabasePathName(
                userId,
              )}/${myUsernamePath}`,
            )
            .on('child_added', async (snap) => {
              // console.log('allowListenChildAdd 11', allowListenChildAdd);
              if (allowListenChildAdd) {
                const child = snap.val();
                const msg = Object.assign(Object.assign({}, child), {
                  userId: myUsername,
                });
                const extraMsgList = [...store.getState().messages];
                const extraMsgIndex = extraMsgList.findIndex(
                  (x) => x.ownUser.username === userId,
                );
                if (extraMsgIndex > -1) {
                  const extraMsg = extraMsgList[extraMsgIndex];
                  extraMsg.messageList = [msg, ...extraMsg.messageList];
                  extraMsgList[extraMsgIndex] = Object.assign({}, extraMsg);
                } else {
                  const rq = await firestore()
                    .collection('users')
                    .doc(`${userId}`)
                    .get();
                  const userData = rq.data() || {};
                  dbRef.ref(`/online/${snap.key}`).once('value', (snap2) => {
                    const extraMsg = {
                      ownUser: userData,
                      messageList: [msg],
                      online: snap2.val(),
                    };
                    const newExtraMsgList = [extraMsg, ...extraMsgList];
                    extraMsgList.sort(
                      (a, b) =>
                        (b.messageList.length > 0
                          ? b.messageList[0].create_at
                          : 0) -
                        (a.messageList.length > 0
                          ? a.messageList[0].create_at
                          : 0),
                    );
                    return dispatch(
                      TriggerMessageListenerSuccess(newExtraMsgList),
                    );
                  });
                }
                extraMsgList.sort(
                  (a, b) =>
                    (b.messageList.length > 0
                      ? b.messageList[0].create_at
                      : 0) -
                    (a.messageList.length > 0 ? a.messageList[0].create_at : 0),
                );
                dispatch(TriggerMessageListenerSuccess(extraMsgList));
              }
            });
        });
        const fetchMyMessagesTasks = userIds.map((userId, index) => {
          return new Promise((resolve, reject) => {
            dbRef
              .ref(
                `/messages/${convertToFirebaseDatabasePathName(
                  userId,
                )}/${myUsernamePath}`,
              )
              .once('value', (snap2) => {
                resolve();
                if (snap2.val() !== 'NULL') {
                  snap2.forEach((m) => {
                    messageCollection[index].push(
                      Object.assign(Object.assign({}, m.val()), {
                        userId: myUsername,
                      }),
                    );
                  });
                }
                messageCollection[index].sort(
                  (a, b) => b.create_at - a.create_at,
                );
              });
          });
        });
        const fetchUserStatusTasks = userIds.map((userId, index) => {
          return new Promise((resolve, reject) => {
            dbRef
              .ref(`/online/${convertToFirebaseDatabasePathName(userId)}`)
              .once('value', (snap3) => {
                resolve(snap3.val());
              });
          });
        });
        Promise.all(fetchMyMessagesTasks).then(async () => {
          const preUserInfos = store.getState().messages.map((x) => x.ownUser);
          const fetchUserInfoListTasks = userIds.map(async (userId) => {
            let idx = -1;
            preUserInfos.find((x, index) => {
              if (x.username === userId) {
                idx = index;
              }
              return x.username === userId;
            });
            if (idx > -1) {
              return preUserInfos[idx];
            }
            const rq = await ref.collection('users').doc(`${userId}`).get();
            const userData = rq.data() || {};
            return userData;
          });
          const userInfos = await Promise.all(fetchUserInfoListTasks);
          const onlineStatus = await Promise.all(fetchUserStatusTasks);
          const collection = messageCollection.map((messageGroup, index) => {
            return {
              messageList: messageGroup,
              ownUser: userInfos[index],
              online: onlineStatus[index],
            };
          });
          collection.sort(
            (a, b) =>
              (b.messageList.length > 0 ? b.messageList[0].create_at : 0) -
              (a.messageList.length > 0 ? a.messageList[0].create_at : 0),
          );
          allowListenChildAdd = true;
          // console.log('allowListenChildAdd set true', allowListenChildAdd);
          dispatch(TriggerMessageListenerSuccess(collection));
        });
      });
      //
    } catch (e) {
      console.log(e);
      dispatch(TriggerMessageListenerFailure());
    }
  };
};
export const TriggerMessageListenerFailure = () => {
  return {
    type: messagesActionTypes.TRIGGER_MESSAGES_LISTENER_FAILURE,
    payload: {
      message: 'Get Messages Failed!',
    },
  };
};
export const TriggerMessageListenerSuccess = (payload) => {
  return {
    type: messagesActionTypes.TRIGGER_MESSAGES_LISTENER_SUCCESS,
    payload: payload,
  };
};
export const CreateMessageRequest = (message, targetUsername) => {
  return async (dispatch) => {
    try {
      const targetUsernamePath = convertToFirebaseDatabasePathName(
        targetUsername,
      );
      const myUsername = store.getState().user.user.userInfo?.username || '';
      const myUsernamePath = convertToFirebaseDatabasePathName(myUsername);
      const dbRef = database();
      const ref = firestore();
      const uid = message.uid || new Date().getTime();
      const msg = Object.assign(Object.assign({}, message), {
        userId: myUsername,
        uid,
      });
      dbRef
        .ref(`/messages/${targetUsernamePath}/${myUsernamePath}/${uid}`)
        .set(msg);
      // const extraMsg = store.getState().messages.find(x => x.ownUser.username === targetUsername)
      // if (extraMsg) {
      //     const index = store.getState().messages.findIndex(x => x === extraMsg)
      //     const newExtraMsg = { ...extraMsg }
      //     newExtraMsg.messageList = [msg, ...newExtraMsg.messageList]
      //     const newExtraList = [...store.getState().messages]
      //     newExtraList[index] = newExtraMsg
      //     dispatch(TriggerMessageListenerSuccess(newExtraList))
      // } else {
      //     const rq = await ref.collection('users').doc(`${targetUsername}`).get()
      //     const targetUserData: ProfileX = rq.data() || {}
      //     dbRef.ref(`/online/${targetUsernamePath}`).once('value', snap => {
      //         const newExtraMsg: ExtraMessage = {
      //             messageList: [msg],
      //             ownUser: targetUserData,
      //             online: snap.val()
      //         }
      //         const newExtraList = [...store.getState().messages]
      //         newExtraList.push(newExtraMsg)
      //         dispatch(TriggerMessageListenerSuccess(newExtraList))
      //     })
      // }
    } catch (e) {
      console.log(e);
      dispatch(TriggerMessageListenerFailure());
    }
  };
};
export const MakeSeenRequest = (targetUsername, msgUid) => {
  return async (dispatch) => {
    try {
      const targetUsernamePath = convertToFirebaseDatabasePathName(
        targetUsername,
      );
      const myUsername = store.getState().user.user.userInfo?.username || '';
      const myUsernamePath = convertToFirebaseDatabasePathName(myUsername);
      const dbRef = database();
      dbRef
        .ref(`/messages/${myUsernamePath}/${targetUsernamePath}/${msgUid}`)
        .update({
          seen: seenTypes.SEEN,
        });
      dbRef
        .ref(`/messages/${targetUsernamePath}/forceUpdate`)
        .set(Math.random());
      const extraMsg = store
        .getState()
        .messages.find((x) => x.ownUser.username === targetUsername);
      if (extraMsg) {
        const msg = extraMsg.messageList.find((x) => x.uid === msgUid);
        if (msg) {
          msg.seen = 1;
          dispatch(
            TriggerMessageListenerSuccess([...store.getState().messages]),
          );
        } else {
          dispatch(TriggerMessageListenerFailure());
        }
      } else {
        dispatch(TriggerMessageListenerFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(TriggerMessageListenerFailure());
    }
  };
};
export const CreateEmptyConversationRequest = (targetUsername) => {
  return async (dispatch) => {
    try {
      const targetUsernamePath = convertToFirebaseDatabasePathName(
        targetUsername,
      );
      const myUsername = store.getState().user.user.userInfo?.username || '';
      const myUsernamePath = convertToFirebaseDatabasePathName(myUsername);
      const dbRef = database();
      const ref = firestore();
      const rq = await ref.collection('users').doc(`${targetUsername}`).get();
      if (rq.exists) {
        dbRef
          .ref(`/messages/${targetUsernamePath}/${myUsernamePath}`)
          .set('NULL');
        dbRef
          .ref(`/messages/${myUsernamePath}/${targetUsernamePath}`)
          .set('NULL');
        const extraMsg = store
          .getState()
          .messages.find((x) => x.ownUser.username === targetUsername);
        const targetUserData = rq.data() || {};
        dbRef.ref(`/online/${targetUsernamePath}`).once('value', (snap) => {
          const newExtraMsg = {
            messageList: [],
            ownUser: targetUserData,
            online: snap.val(),
          };
          const newExtraList = [newExtraMsg, ...store.getState().messages];
          newExtraList.sort(
            (a, b) =>
              (b.messageList.length > 0 ? b.messageList[0].create_at : 0) -
              (a.messageList.length > 0 ? a.messageList[0].create_at : 0),
          );
          dispatch(TriggerMessageListenerSuccess(newExtraList));
          dispatch(TriggerMessageListenerRequest());
        });
      } else {
        dispatch(TriggerMessageListenerFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(TriggerMessageListenerFailure());
    }
  };
};
export const AddEmoijToMessageRequest = (targetUsername, msgId, emoji) => {
  return async (dispatch) => {
    try {
      const targetUsernamePath = convertToFirebaseDatabasePathName(
        targetUsername,
      );
      const myUsername = store.getState().user.user.userInfo?.username || '';
      const myUsernamePath = convertToFirebaseDatabasePathName(myUsername);
      const dbRef = database();
      const extraMsgIndex = store
        .getState()
        .messages.findIndex((x) => x.ownUser.username === targetUsername);
      if (extraMsgIndex > -1) {
        const extraMsg = store.getState().messages[extraMsgIndex];
        const msgIndex = extraMsg.messageList.findIndex((x) => x.uid === msgId);
        if (msgIndex > -1) {
          const msg = extraMsg.messageList[msgIndex];
          if (msg.userId === targetUsername) {
            dbRef
              .ref(
                `/messages/${myUsernamePath}/${targetUsernamePath}/${msgId}/yourEmoji`,
              )
              .set(emoji);
          } else if (msg.userId === myUsername) {
            dbRef
              .ref(
                `/messages/${targetUsernamePath}/${myUsernamePath}/${msgId}/ownEmoji`,
              )
              .set(emoji);
          }
        } else {
          dispatch(TriggerMessageListenerFailure());
        }
      } else {
        dispatch(TriggerMessageListenerFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(TriggerMessageListenerFailure());
    }
  };
};
export const RemoveEmoijToMessageRequest = (targetUsername, msgId) => {
  return async (dispatch) => {
    try {
      const targetUsernamePath = convertToFirebaseDatabasePathName(
        targetUsername,
      );
      const myUsername = store.getState().user.user.userInfo?.username || '';
      const myUsernamePath = convertToFirebaseDatabasePathName(myUsername);
      const dbRef = database();
      const extraMsgIndex = store
        .getState()
        .messages.findIndex((x) => x.ownUser.username === targetUsername);
      if (extraMsgIndex > -1) {
        const extraMsg = store.getState().messages[extraMsgIndex];
        const msgIndex = extraMsg.messageList.findIndex((x) => x.uid === msgId);
        if (msgIndex > -1) {
          const msg = extraMsg.messageList[msgIndex];
          if (msg.userId === targetUsername) {
            dbRef
              .ref(
                `/messages/${myUsernamePath}/${targetUsernamePath}/${msgId}/yourEmoji`,
              )
              .remove();
          } else if (msg.userId === myUsername) {
            dbRef
              .ref(
                `/messages/${targetUsernamePath}/${myUsernamePath}/${msgId}/ownEmoji`,
              )
              .remove();
          }
        } else {
          dispatch(TriggerMessageListenerFailure());
        }
      } else {
        dispatch(TriggerMessageListenerFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(TriggerMessageListenerFailure());
    }
  };
};
export const UndoMyLastMessageRequest = (targetUsername) => {
  return async (dispatch) => {
    try {
      const targetUsernamePath = convertToFirebaseDatabasePathName(
        targetUsername,
      );
      const myUsername = store.getState().user.user.userInfo?.username || '';
      const myUsernamePath = convertToFirebaseDatabasePathName(myUsername);
      const dbRef = database();
      dbRef
        .ref(`/messages/${targetUsernamePath}/${myUsernamePath}`)
        .once('value', (snap) => {
          const msgList = [];
          snap.forEach((msg) => {
            msgList.push(msg.val());
          });
          const myLastMsg = msgList.pop();
          if (myLastMsg) {
            const uid = myLastMsg.uid;
            dbRef
              .ref(`/messages/${targetUsernamePath}/${myUsernamePath}/${uid}`)
              .remove();
            dispatch(TriggerMessageListenerRequest());
          }
        });
    } catch (e) {
      console.log(e);
      dispatch(TriggerMessageListenerFailure());
    }
  };
};
