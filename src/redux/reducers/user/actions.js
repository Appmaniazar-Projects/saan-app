// import {auth, firestore, storage} from 'firebase';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {DEFAULT_PHOTO_URI} from '../../../constants';
import {navigate} from '../../../common/RootNavigation';
import {defaultUserState, userActionTypes} from './types';
import {store} from '../../store/configureStore';
import {generateUsernameKeywords, uriToBlob, Timestamp} from '../../../utils';
import {Alert} from 'react-native';
import moment from 'moment';
import {CreateNotificationRequest} from '../notification/actions';
import {notificationTypes} from '../notification/types';

export const LoginRequest = (user) => {
  return (dispatch) => {
    return auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then((rs) => {
        if (rs.user) {
          let userx = rs.user;
          firestore()
            .collection('users')
            .where('email', '==', user.email)
            .get()
            .then((rq) => {
              if (rq.size > 0) {
                setTimeout(() => {
                  navigate('DrawerStack');
                }, 300);
                const {
                  avatarURL,
                  bio,
                  birthday,
                  email,
                  followings,
                  fullname,
                  gender,
                  phone,
                  searchRecent,
                  username,
                  website,
                  requestedList,
                  notificationSetting,
                  privacySetting,
                  postNotificationList,
                  storyNotificationList,
                  unSuggestList,
                } = rq.docs[0].data();
                const result = {
                  user: {
                    logined: true,
                    firebaseUser: userx,
                    userInfo: {
                      avatarURL,
                      bio,
                      birthday,
                      email,
                      followings,
                      fullname,
                      gender,
                      phone,
                      searchRecent: searchRecent || [],
                      username,
                      website,
                      storyNotificationList,
                      postNotificationList,
                      requestedList,
                      unSuggestList,
                    },
                  },
                  setting: {
                    notification:
                      notificationSetting ||
                      defaultUserState.setting?.notification,
                    privacy:
                      privacySetting || defaultUserState.setting?.privacy,
                  },
                };
                dispatch(LoginSuccess(result));
              } else {
                console.log(rq);
                dispatch(LoginFailure());
              }
            });
        } else {
          console.log(rs);
          dispatch(LoginFailure());
        }
      })
      .catch((e) => {
        console.log(e);
        dispatch(LoginFailure());
      });
  };
};

export const LoginWithFB = (userData) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      try {
        let userx = {};
        const rq = await firestore()
          .collection('users')
          .where('username', '==', userData.username)
          .get();
        if (rq.size > 0) {
          setTimeout(() => {
            navigate('DrawerStack');
          }, 300);
          const {
            avatarURL,
            bio,
            birthday,
            email,
            followings,
            fullname,
            gender,
            phone,
            searchRecent,
            username,
            website,
            requestedList,
            notificationSetting,
            privacySetting,
            postNotificationList,
            storyNotificationList,
            unSuggestList,
          } = rq.docs[0].data();
          const result = {
            user: {
              logined: true,
              firebaseUser: userx,
              userInfo: {
                avatarURL,
                bio,
                birthday,
                email,
                followings,
                fullname,
                gender,
                phone,
                searchRecent: searchRecent || [],
                username,
                website,
                storyNotificationList,
                postNotificationList,
                requestedList,
                unSuggestList,
              },
            },
            setting: {
              notification:
                notificationSetting || defaultUserState.setting?.notification,
              privacy: privacySetting || defaultUserState.setting?.privacy,
            },
          };
          dispatch(LoginSuccess(result));
          resolve();
        } else {
          console.log('User not found');
          dispatch(LoginFailure());
          reject(new Error('User not found'));
        }
      } catch (error) {
        console.log(error);
        dispatch(LoginFailure());
        reject(error);
      }
    });
  };
};

export const setFcmToken = (fcmToken) => {
  return (dispatch) => {
    return dispatch({
      type: userActionTypes.SET_FCM_TOKEN,
      payload: fcmToken,
    });
  };
};

export const LoginFBMain = (userData) => {
  return (dispatch) => {
    const username = getUsernameFacebook(userData);
    return new Promise(async (resolve, reject) => {
      try {
        const rq = await firestore()
          .collection('users')
          .where('username', '==', username)
          .get();
        // console.log(rq)
        if (rq.size > 0) {
          dispatch(LoginWithFB({...userData, username}));
        } else {
          firestore()
            .collection('users')
            .doc(username)
            .set({
              email: userData.email || '',
              fullname: userData.displayName || '',
              keyword: generateUsernameKeywords(username),
              phone: userData.phoneNumber || '',
              username: username || '',
              birthday: {
                date: userData.date || 1,
                month: userData.month || 1,
                year: userData.year || 2020,
              },
              bio: '',
              gender: 2,
              accountType: 1,
              skills: '',
              followings: [username],
              requestedList: [],
              searchRecent: [],
              notificationTokens: [],
              storyNotificationList: [],
              postNotificationList: [],
              website: '',
              avatarURL: userData.photoURL || DEFAULT_PHOTO_URI,
              privacySetting: {
                ...defaultUserState.setting?.privacy,
              },
              notificationSetting: {
                ...defaultUserState.setting?.notification,
              },
              created_at: Math.round(moment().unix() / 1000, 0),
            });
          dispatch(LoginWithFB({...userData, username}));
          // dispatch(
          //   LoginWithMobile({
          //     username: username || '',
          //     phone: userData.phoneNumber || '',
          //   }),
          // );
        }

        resolve();
      } catch (error) {
        console.log(error);
        dispatch(RegisterFailure(`${error}`));
        reject(error);
      }
    });
  };
};

export const getUsernameFacebook = (userData) => {
  let username = userData.uid;
  if (userData.email) {
    const tmpString = userData.email.split('@');
    // const username = tmpString[0];
    username = tmpString[0];
  } else if (userData.phoneNumber) {
    username = `${userData.phoneNumber}`;
  }
  return username;
};

export const LoginWithMobile = (userData) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      try {
        let userx = {};
        const rq = await firestore()
          .collection('users')
          .where('phone', '==', userData.phone)
          .get();
        if (rq.size > 0) {
          setTimeout(() => {
            navigate('DrawerStack');
          }, 300);
          const {
            avatarURL,
            bio,
            birthday,
            email,
            followings,
            fullname,
            gender,
            phone,
            searchRecent,
            username,
            website,
            requestedList,
            notificationSetting,
            privacySetting,
            postNotificationList,
            storyNotificationList,
            unSuggestList,
          } = rq.docs[0].data();
          const result = {
            user: {
              logined: true,
              firebaseUser: userx,
              userInfo: {
                avatarURL,
                bio,
                birthday,
                email,
                followings,
                fullname,
                gender,
                phone,
                searchRecent: searchRecent || [],
                username,
                website,
                storyNotificationList,
                postNotificationList,
                requestedList,
                unSuggestList,
              },
            },
            setting: {
              notification:
                notificationSetting || defaultUserState.setting?.notification,
              privacy: privacySetting || defaultUserState.setting?.privacy,
            },
          };
          dispatch(LoginSuccess(result));
          resolve();
        } else {
          console.log('User not found');
          dispatch(LoginFailure());
          reject(new Error('User not found'));
        }
      } catch (error) {
        console.log(error);
        dispatch(LoginFailure());
        reject(error);
      }
    });
  };
};

export const MobileRequest = (userData) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      try {
        firestore()
          .collection('users')
          .doc(userData.username)
          .set({
            email: userData.email || '',
            fullname: userData.fullname || '',
            keyword: generateUsernameKeywords(userData.username),
            phone: userData.phone || '',
            username: userData.username || '',
            birthday: {
              date: userData.date || 1,
              month: userData.month || 1,
              year: userData.year || 2020,
            },
            bio: '',
            gender: 2,
            accountType: 1,
            skills: '',
            followings: [userData.username],
            requestedList: [],
            searchRecent: [],
            notificationTokens: [],
            storyNotificationList: [],
            postNotificationList: [],
            website: '',
            avatarURL: DEFAULT_PHOTO_URI,
            privacySetting: {
              ...defaultUserState.setting?.privacy,
            },
            notificationSetting: {
              ...defaultUserState.setting?.notification,
            },
            created_at: Math.round(moment().unix() / 1000, 0),
          });
        dispatch(
          LoginWithMobile({
            username: userData.username || '',
            phone: userData.phone || '',
          }),
        );
        resolve();
      } catch (error) {
        console.log(error);
        dispatch(RegisterFailure(`${error}`));
        reject(error);
      }
    });
  };
};

export const LoginFailure = () => {
  return {
    type: userActionTypes.LOGIN_FAILURE,
    payload: {
      message: 'Login Failed!',
    },
  };
};
export const LoginSuccess = (payload) => {
  return {
    type: userActionTypes.LOGIN_SUCCESS,
    payload: payload,
  };
};
export const LogoutRequest = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: userActionTypes.LOGOUT_SUCCESS,
        payload: {},
      });
    } catch (e) {
      dispatch({
        type: userActionTypes.LOGOUT_FAILURE,
        payload: {
          message: 'Can not logout now!',
        },
      });
    }
  };
};
export const RegisterRequest = (userData) => {
  return (dispatch) => {
    // alert(String(userData.email))
    return auth()
      .createUserWithEmailAndPassword(userData.email, userData.password)
      .then((rs) => {
        rs.user?.sendEmailVerification();
        firestore()
          .collection('users')
          .doc(userData.username)
          .set({
            email: userData.email,
            fullname: userData.fullname,
            keyword: generateUsernameKeywords(userData.username),
            phone: userData.phone,
            username: userData.username,
            birthday: {
              date: userData.date,
              month: userData.month,
              year: userData.year,
            },
            bio: '',
            gender: 2,
            accountType: 1,
            skills: '',
            followings: [userData.username],
            requestedList: [],
            searchRecent: [],
            notificationTokens: [],
            storyNotificationList: [],
            postNotificationList: [],
            website: '',
            avatarURL: DEFAULT_PHOTO_URI,
            privacySetting: {
              ...defaultUserState.setting?.privacy,
            },
            notificationSetting: {
              ...defaultUserState.setting?.notification,
            },
            created_at: Math.round(moment().unix() / 1000, 0),
          });
        dispatch(
          LoginRequest({
            email: userData.email,
            password: userData.password,
          }),
        );
      })
      .catch((e) => {
        // alert("register faile")
        dispatch(RegisterFailure(`${e}`));
      });
  };
};
export const RegisterFailure = (e) => {
  return {
    payload: {
      message: e,
    },
    type: userActionTypes.REGISTER_FAILURE,
  };
};
export const UnfollowRequest = (username) => {
  return async (dispatch) => {
    try {
      let me = Object.assign({}, store.getState().user.user.userInfo);
      const ref = firestore();
      const rq = await ref
        .collection('users')
        .where('username', '==', me.username)
        .get();
      if (rq.size > 0) {
        const targetUser = rq.docs[0];
        const user = targetUser.data() || {};
        if (
          user.followings !== undefined &&
          user.followings.indexOf(username) > -1
        ) {
          const followings = [...user.followings];
          followings.splice(followings.indexOf(username), 1);
          await targetUser.ref.update({
            followings,
          });
          dispatch(
            CreateNotificationRequest({
              isUndo: true,
              postId: 0,
              replyId: 0,
              commentId: 0,
              userId: [username],
              from: me.username,
              create_at: Timestamp(),
              type: notificationTypes.FOLLOW_ME,
            }),
          );
        }
        const rq2 = await targetUser.ref.get();
        me = rq2.data() || {};
        dispatch(UnfollowSuccess(me));
      } else {
      }
    } catch (e) {
      console.log(e);
      dispatch(UnfollowFailure());
    }
  };
};
export const UnfollowFailure = () => {
  return {
    type: userActionTypes.UNFOLLOW_FAILURE,
    payload: {
      message: "Can't unfollow this people!",
    },
  };
};
export const UnfollowSuccess = (user) => {
  return {
    type: userActionTypes.UNFOLLOW_SUCCESS,
    payload: user,
  };
};
/**
 * FETCH EXTRA INFO ACTION
 */
export const FetchExtraInfoRequest = () => {
  return async (dispatch) => {
    try {
      let me = Object.assign({}, store.getState().user.user.userInfo);
      const ref = firestore();
      const rq = await ref
        .collection('posts')
        .where('userId', '==', me.username)
        .orderBy('create_at', 'desc')
        .get();
      const tagPhotos = await ref
        .collection('posts')
        .where('tagUsername', 'array-contains', me.username)
        .orderBy('create_at', 'desc')
        .get();
      const payload = {
        currentStory: [],
        extraInfo: {
          unSuggestList: [],
          requestedList: [],
          followers: [],
          followings: [],
          posts: rq.size || 0,
        },
        photos: rq.docs.map((x) => x.data()),
        tagPhotos: tagPhotos.docs.map((x) => x.data()),
      };
      const rq2 = await ref
        .collection('users')
        .where('username', '==', me.username)
        .limit(1)
        .get();
      if (rq2.size > 0) {
        payload.extraInfo.followings = rq2.docs[0].data().followings || [];
        payload.extraInfo.unSuggestList =
          rq2.docs[0].data().unSuggestList || [];
        payload.extraInfo.requestedList =
          rq2.docs[0].data().requestedList || [];
        const rq3 = await ref
          .collection('users')
          .where('followings', 'array-contains', me.username)
          .get();
        payload.extraInfo.followers = rq3.docs.map((x) => x.data().username);
        const rq5 = await ref
          .collection('stories')
          .where('userId', '==', me.username)
          .where(
            'create_at',
            '>=',
            new Date(new Date().getTime() - 24 * 3600 * 1000),
          )
          .orderBy('create_at', 'asc')
          .get();
        payload.currentStory = rq5.docs.map((x) => x.data());
        dispatch(FetchExtraInfoSuccess(payload));
      } else {
        dispatch(FetchExtraInfoFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(FetchExtraInfoFailure());
    }
  };
};
export const FetchExtraInfoFailure = () => {
  return {
    type: userActionTypes.FETCH_EXTRA_INFO_FAILURE,
    payload: {
      message: "Can't get information",
    },
  };
};
export const FetchExtraInfoSuccess = (extraInfo) => {
  return {
    type: userActionTypes.FETCH_EXTRA_INFO_SUCCESS,
    payload: extraInfo,
  };
};
//update extra info
export const UpdateExtraInfoRequest = (data) => {
  return async (dispatch) => {
    try {
      dispatch(FetchExtraInfoSuccess(data));
    } catch (e) {
      console.log(e);
      dispatch(FetchExtraInfoFailure());
    }
  };
};
//
export const FollowContactsRequest = (phoneList) => {
  return async (dispatch) => {
    try {
      let me = Object.assign({}, store.getState().user.user.userInfo);
      const ref = firestore();
      const rq = await ref
        .collection('users')
        .where('username', '==', me.username)
        .get();
      if (rq.size > 0) {
        const targetUser = rq.docs[0];
        let userList = [];
        phoneList.map(async (phone, index) => {
          const rq2 = await ref
            .collection('users')
            .where('phone', '==', phone)
            .get();
          if (rq2.docs.length > 0) {
            const user = rq2.docs[0].data();
            if (user.username) {
              userList.push(user.username);
            }
          }
          if (index === phoneList.length - 1) {
            userList.map(async (username, index2) => {
              const user = targetUser.data() || {};
              if (
                user.followings !== undefined &&
                user.followings.indexOf(username) < 0 &&
                username !== me.username
              ) {
                user.followings.push(username);
                const followings = [...user.followings];
                await targetUser.ref.update({
                  followings,
                });
              }
              if (index2 === userList.length - 1) {
                // eslint-disable-next-line no-shadow
                const rq2 = await targetUser.ref.get();
                me = rq2.data() || {};
                dispatch(FollowUserSuccess(me));
              }
            });
          }
        });
      } else {
        dispatch(FollowUserFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(FollowUserFailure());
    }
  };
};
export const ToggleFollowUserRequest = (username, refreshExtraInfo = false) => {
  return async (dispatch) => {
    try {
      let me = Object.assign({}, store.getState().user.user.userInfo);
      const ref = firestore();
      const rq = await ref
        .collection('users')
        .where('username', '==', me.username)
        .get();
      const targetUser = await ref.collection('users').doc(username).get();
      if (rq.size > 0) {
        const myUser = rq.docs[0];
        const userData = myUser.data() || {};
        const currentFollowings = userData.followings || [];
        const index = currentFollowings.indexOf(username);
        const targetUserData = targetUser.data() || {};
        if (index < 0) {
          if (targetUserData.privacySetting?.accountPrivacy.private) {
            dispatch(ToggleSendFollowRequest(username));
          } else {
            currentFollowings.push(username);
          }
        } else {
          // currentFollowings.splice(index, 1);
        }
        myUser.ref.update({
          followings: currentFollowings,
        });
        //add notification
        if (
          index < 0 &&
          !targetUserData.privacySetting?.accountPrivacy.private
        ) {
          dispatch(
            CreateNotificationRequest({
              postId: 0,
              replyId: 0,
              commentId: 0,
              userId: [username],
              from: me.username,
              create_at: Timestamp(),
              type: notificationTypes.FOLLOW_ME,
            }),
          );
        } else if (
          index > -1 &&
          !targetUserData.privacySetting?.accountPrivacy.private
        ) {
          dispatch(
            CreateNotificationRequest({
              isUndo: true,
              postId: 0,
              replyId: 0,
              commentId: 0,
              userId: [username],
              from: me.username,
              create_at: Timestamp(),
              type: notificationTypes.FOLLOW_ME,
            }),
          );
        }
        dispatch(FollowUserSuccess(userData));
        if (refreshExtraInfo) {
          dispatch(FetchExtraInfoRequest());
        }
      } else {
        dispatch(FollowUserFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(FollowUserFailure());
    }
  };
};
export const FollowUserSuccess = (payload) => {
  return {
    type: userActionTypes.FOLLOW_SUCCESS,
    payload,
  };
};
export const FollowUserFailure = () => {
  return {
    type: userActionTypes.FOLLOW_FAILURE,
    payload: {
      message: "Error! Can't send following request",
    },
  };
};
//SEND FOLLOW REQUEST
export const ToggleSendFollowRequest = (username) => {
  return async (dispatch) => {
    try {
      let me = Object.assign({}, store.getState().user.user.userInfo);
      const ref = firestore();
      const rq = await ref
        .collection('users')
        .where('username', '==', me.username)
        .get();
      if (rq.size > 0) {
        const targetUser = await ref.collection('users').doc(username).get();
        const targetUserData = targetUser.data() || {};
        const requestedList = targetUserData.requestedList || [];
        const index = requestedList.indexOf(me.username);
        if (index < 0) {
          requestedList.push(me.username);
        } else {
          requestedList.splice(index, 1);
        }
        targetUser.ref.update({
          requestedList,
        });
      } else {
        dispatch(FollowUserFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(FollowUserFailure());
    }
  };
};
//UPDATE USER INFO ACTIONS
export const UpdateUserInfoRequest = (updateUserData) => {
  return async (dispatch) => {
    try {
      let me = Object.assign({}, store.getState().user.user.userInfo);
      const ref = firestore();
      const rq = await ref
        .collection('users')
        .where('username', '==', me.username)
        .get();
      if (rq.size > 0) {
        const userData = rq.docs[0].data();
        const userRef = rq.docs[0].ref;
        const userInfo = Object.assign(
          Object.assign({}, userData),
          updateUserData,
        );
        const {
          email,
          avatarURL,
          bio,
          birthday,
          followings,
          fullname,
          gender,
          phone,
          username,
          website,
          accountType,
          skills,
        } = userInfo;
        const filterdUserInfo = {
          email,
          avatarURL,
          bio,
          birthday,
          followings,
          fullname,
          gender,
          phone,
          username,
          website,
          accountType,
          skills,
        };
        if (userInfo.username !== me.username) {
          ref.collection('users').doc(userInfo.username).set(userInfo);
          ref.collection('users').doc(me.username).delete();
        } else {
          userRef.update(userInfo);
        }
        dispatch(UpdateUserInfoSuccess(filterdUserInfo));
      } else {
        dispatch(UpdateUserInfoFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(UpdateUserInfoFailure());
    }
  };
};
export const UpdateUserInfoFailure = () => {
  return {
    type: userActionTypes.UPDATE_USER_INFO_FAILURE,
    payload: {
      message: "Can't update now, try again!",
    },
  };
};
export const UpdateUserInfoSuccess = (user) => {
  return {
    type: userActionTypes.UPDATE_USER_INFO_SUCCESS,
    payload: user,
  };
};

//UPDATE NOTIFICATION ACTIONS
export const UpdateNotificationSettingsRequest = (setting) => {
  return async (dispatch) => {
    try {
      if (Object.keys(setting).length === 0) {
        throw new Error();
      }
      // eslint-disable-next-line no-unused-vars
      const targetSetting = Object.keys(setting)[0];
      let me = {...store.getState().user.user.userInfo};
      const ref = firestore();
      const rq = await ref.collection('users').doc(me.username).get();
      const targetUser = rq.ref;

      const user = rq.data() || {};
      if (user.notificationSetting) {
        for (let [key, value] of Object.entries(user.notificationSetting)) {
          if (setting.hasOwnProperty(key)) {
            value = value;
            setting[key] = {
              ...value,
              ...Object.values(setting)[0],
            };
            break;
          }
        }
      }
      await targetUser.update({
        notificationSetting: {
          ...(user.notificationSetting || {}),
          ...setting,
        },
      });
      // eslint-disable-next-line no-unused-vars
      const rq2 = await targetUser.get();
      // eslint-disable-next-line no-unused-vars
      const result = rq.data() || {};
      dispatch(
        UpdateNotificationSettingSuccess({
          ...(user.notificationSetting || {}),
          ...setting,
        }),
      );
    } catch (e) {
      dispatch(UpdateNotificationSettingFailure());
    }
  };
};
export const UpdateNotificationSettingSuccess = (payload) => {
  return {
    type: userActionTypes.UPDATE_NOTIFICATION_SETTING_SUCCESS,
    payload,
  };
};
export const UpdateNotificationSettingFailure = () => {
  return {
    type: userActionTypes.UPDATE_NOTIFICATION_SETTING_FAILURE,
    payload: {
      message: "Error! Can't update setting",
    },
  };
};
//UPDATE PRIVACY SETTING ACTIONS
export const UpdatePrivacySettingsRequest = (setting) => {
  return async (dispatch) => {
    try {
      if (Object.keys(setting).length === 0) {
        throw new Error();
      }
      // eslint-disable-next-line no-unused-vars
      const targetSetting = Object.keys(setting)[0];
      let me = {...store.getState().user.user.userInfo};
      const ref = firestore();
      const rq = await ref.collection('users').doc(me.username).get();
      const targetUser = rq.ref;

      const user = rq.data() || {};
      if (user.privacySetting) {
        for (let [key, value] of Object.entries(user.privacySetting)) {
          if (setting.hasOwnProperty(key)) {
            value = value;
            setting[key] = {
              ...value,
              ...Object.values(setting)[0],
            };
            break;
          }
        }
      }
      await targetUser.update({
        privacySetting: {
          ...(user.privacySetting || {}),
          ...setting,
        },
      });
      // eslint-disable-next-line no-unused-vars
      const rq2 = await targetUser.get();
      // eslint-disable-next-line no-unused-vars
      const result = rq.data() || {};
      dispatch(
        UpdatePrivacySettingSuccess({
          ...(user.privacySetting || {}),
          ...setting,
        }),
      );
    } catch (e) {
      console.log(e);
      dispatch(UpdatePrivacySettingFailure());
    }
  };
};
export const UpdatePrivacySettingSuccess = (payload) => {
  return {
    type: userActionTypes.UPDATE_PRIVACY_SETTING_SUCCESS,
    payload,
  };
};
export const UpdatePrivacySettingFailure = () => {
  return {
    type: userActionTypes.UPDATE_PRIVACY_SETTING_FAILURE,
    payload: {
      message: "Error! Can't update setting",
    },
  };
};
export const UploadAvatarRequest = (uri, extension) => {
  return async (dispatch) => {
    try {
      const me = store.getState().user.user.userInfo;
      // const blob = await uriToBlob(uri);
      const result = await storage()
        .ref()
        .child(`avatar/${me?.username}.${extension}`)
        // .put(blob, {
        //   contentType: `image/${extension}`,
        // });
        .putFile(uri);
      console.log(result);
      const downloadUri = await storage()
        .ref(result.metadata.fullPath)
        .getDownloadURL();
      dispatch(
        UpdateUserInfoRequest({
          avatarURL: downloadUri,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  };
};
export const RemoveFollowerRequest = (username) => {
  return async (dispatch) => {
    try {
      const me = store.getState().user.user.userInfo;
      const ref = firestore();
      const myUsername = me?.username || '';
      const rq = await ref.collection('users').doc(username).get();
      const targetUser = rq.data() || {};
      const targetFollowings = targetUser.followings || [];
      const index = targetFollowings.indexOf(myUsername);
      if (index > -1) {
        targetFollowings.splice(index, 1);
        rq.ref.update({
          followings: [...targetFollowings],
        });
        dispatch(FetchExtraInfoRequest());
      }
    } catch (e) {}
  };
};
//FETCH SETTING ACTION
export const FetchSettingRequest = () => {
  return async (dispatch) => {
    const me = store.getState().user.user.userInfo;
    const rq = await firestore().collection('users').doc(me?.username).get();
    if (rq.exists) {
      const {notificationSetting, privacySetting} = rq.data() || {};
      const result = {
        notification:
          notificationSetting || defaultUserState.setting?.notification,
        privacy: privacySetting || defaultUserState.setting?.privacy,
      };
      dispatch(FetchSettingSuccess(result));
    } else {
      dispatch(FetchSettingFailure());
    }
  };
};
export const FetchSettingFailure = () => {
  return {
    type: userActionTypes.FETCH_SETTING_FAILURE,
    payload: {
      message: 'FetchSetting Failed!',
    },
  };
};
export const FetchSettingSuccess = (payload) => {
  return {
    type: userActionTypes.FETCH_SETTING_SUCCESS,
    payload: payload,
  };
};
//CONFIRM REQUEST ACTION
export const ConfirmFollowRequest = (username) => {
  return async (dispatch) => {
    const me = store.getState().user.user.userInfo;
    const ref = firestore();
    const rq = await ref.collection('users').doc(me?.username).get();
    const targetUser = await ref.collection('users').doc(username).get();
    if (rq.exists && targetUser.exists) {
      const targetUserData = targetUser.data() || {};
      const currentTargetUserFollowings = targetUserData.followings || [];
      if (currentTargetUserFollowings.indexOf(me?.username || '') < 0) {
        currentTargetUserFollowings.push(me?.username || '');
        targetUser.ref.update({
          followings: currentTargetUserFollowings,
        });
      }
      const myUserData = rq.data() || {};
      const currentRequest = myUserData.requestedList || [];
      const index = currentRequest.indexOf(username);
      if (index > -1) {
        currentRequest.splice(index, 1);
        rq.ref.update({
          requestedList: currentRequest,
        });
      }
      dispatch(FetchExtraInfoRequest());
    } else {
      Alert.alert('Error', 'Please check your network!');
    }
  };
};
export const DeclineFollowRequest = (username) => {
  return async (dispatch) => {
    const me = store.getState().user.user.userInfo;
    const ref = firestore();
    const rq = await ref.collection('users').doc(me?.username).get();
    const targetUser = await ref.collection('users').doc(username).get();
    if (rq.exists && targetUser.exists) {
      const targetUserData = targetUser.data() || {};
      const currentTargetUserFollowings = targetUserData.followings || [];
      const index = currentTargetUserFollowings.indexOf(me?.username || '');
      if (index > -1) {
        currentTargetUserFollowings.splice(index, 1);
        targetUser.ref.update({
          followings: currentTargetUserFollowings,
        });
      }
      const myUserData = rq.data() || {};
      const currentRequest = myUserData.requestedList || [];
      const index2 = currentRequest.indexOf(username);
      if (index2 > -1) {
        currentRequest.splice(index2, 1);
        rq.ref.update({
          requestedList: currentRequest,
        });
      }
      dispatch(FetchExtraInfoRequest());
    } else {
      Alert.alert('Error', 'Please check your network!');
    }
  };
};
//ADD UNSUGGESTION LIST
export const UnSuggestionRequest = (username) => {
  return async (dispatch) => {
    const me = store.getState().user.user.userInfo;
    const ref = firestore();
    const rq = await ref.collection('users').doc(me?.username).get();
    if (rq.exists) {
      const myUserData = rq.data() || {};
      const currentUnSuggestList = myUserData.unSuggestList || [];
      const index = currentUnSuggestList.indexOf(username);
      if (index < 0) {
        currentUnSuggestList.push(username);
        rq.ref.update({
          unSuggestList: currentUnSuggestList,
        });
      }
      dispatch(FetchExtraInfoRequest());
    } else {
      Alert.alert('Error', 'Please check your network!');
    }
  };
};
// change search recent list
export const FetchRecentSearchRequest = () => {
  return async (dispatch) => {
    const me = store.getState().user.user.userInfo;
    const ref = firestore();
    const rq = await ref.collection('users').doc(me?.username).get();
    if (rq.exists) {
      const myUserData = rq.data() || {};
      const recentSearchList = myUserData.searchRecent || [];
      dispatch({
        type: userActionTypes.FETCH_RECENT_SEARCH_SUCCESS,
        payload: recentSearchList,
      });
    } else {
      Alert.alert('Error', 'Please check your network!');
    }
  };
};
export const PushRecentSearchRequest = (searchItem) => {
  return async (dispatch) => {
    const me = store.getState().user.user.userInfo;
    const ref = firestore();
    const rq = await ref.collection('users').doc(me?.username).get();
    if (rq.exists) {
      const myUserData = rq.data() || {};
      const recentSearchList = myUserData.searchRecent || [];
      const temp = [...recentSearchList];
      const check = temp.every((item, index) => {
        if (
          (item.username === searchItem.username &&
            searchItem.type === 1 &&
            item.type === 1) ||
          (item.hashtag === searchItem.hashtag &&
            searchItem.type === 2 &&
            item.type === 2) ||
          (item.address === searchItem.address &&
            searchItem.type === 3 &&
            item.type === 3)
        ) {
          recentSearchList.splice(index, 1);
          recentSearchList.push(searchItem);
          return false;
        }
        return true;
      });
      if (check) {
        recentSearchList.push(searchItem);
      }
      rq.ref.update({
        searchRecent: recentSearchList,
      });
      dispatch(FetchRecentSearchRequest());
    } else {
      Alert.alert('Error', 'Please check your network!');
    }
  };
};
export const RemoveRecentSearchRequest = (searchItem) => {
  return async (dispatch) => {
    const me = store.getState().user.user.userInfo;
    const ref = firestore();
    const rq = await ref.collection('users').doc(me?.username).get();
    if (rq.exists) {
      const myUserData = rq.data() || {};
      const recentSearchList = myUserData.searchRecent || [];
      const temp = [...recentSearchList];
      temp.every((item, index) => {
        if (
          (item.username === searchItem.username &&
            searchItem.type === 1 &&
            item.type === 1) ||
          (item.hashtag === searchItem.hashtag &&
            searchItem.type === 2 &&
            item.type === 2) ||
          (item.address === searchItem.address &&
            searchItem.type === 3 &&
            item.type === 3)
        ) {
          recentSearchList.splice(index, 1);
          return false;
        }
        return true;
      });
      rq.ref.update({
        searchRecent: recentSearchList,
      });
      dispatch(FetchRecentSearchRequest());
    } else {
      Alert.alert('Error', 'Please check your network!');
    }
  };
};
export const ToggleBookMarkRequest = (postId, previewUri) => {
  return async (dispatch) => {
    try {
      const collections = [...(store.getState().user.bookmarks || [])];
      if (collections.length > 0) {
        const newCollections = collections
          .map((collection, index) => {
            const bookmarks = [...collection.bookmarks];
            const index2 = bookmarks.findIndex((x) => x.postId === postId);
            if (index2 > -1) {
              bookmarks.splice(index2, 1);
              if (
                collection.avatarIndex === index2 &&
                collection.bookmarks.length > 0
              ) {
                collection.avatarIndex = 0;
              }
            } else {
              if (collection.name === 'All Posts') {
                bookmarks.push({
                  postId,
                  previewUri,
                  create_at: new Date().getTime(),
                });
              }
            }
            return Object.assign(Object.assign({}, collection), {bookmarks});
          })
          .filter((x) => x.bookmarks.length > 0);
        dispatch({
          type: userActionTypes.UPDATE_BOOKMARK_SUCCESS,
          payload: {
            bookmarks: newCollections,
          },
        });
      } else {
        dispatch({
          type: userActionTypes.UPDATE_BOOKMARK_SUCCESS,
          payload: {
            bookmarks: [
              {
                bookmarks: [
                  {
                    create_at: new Date().getTime(),
                    postId,
                    previewUri,
                  },
                ],
                name: 'All Posts',
                create_at: new Date().getTime(),
              },
            ],
          },
        });
      }
    } catch (e) {
      dispatch({
        type: userActionTypes.UPDATE_BOOKMARK_FAILURE,
        payload: {
          message: "Can't not edit bookmark now!",
        },
      });
    }
  };
};
export const CreateBookmarkCollectionRequest = (collection) => {
  return async (dispatch) => {
    try {
      const collections = [...(store.getState().user.bookmarks || [])];
      const index = collections.findIndex((x) => x.name === collection.name);
      if (index > -1) {
        dispatch({
          type: userActionTypes.UPDATE_BOOKMARK_FAILURE,
          payload: {
            message: 'Collection exists, choose another name!',
          },
        });
        return;
      }
      collections.push(collection);
      dispatch({
        type: userActionTypes.UPDATE_BOOKMARK_SUCCESS,
        payload: {
          bookmarks: collections,
        },
      });
    } catch (e) {
      dispatch({
        type: userActionTypes.UPDATE_BOOKMARK_FAILURE,
        payload: {
          message: "Can't not add collection now!",
        },
      });
    }
  };
};
export const RemoveBookmarkCollectionRequest = (collectionName) => {
  return async (dispatch) => {
    try {
      const collections = [...(store.getState().user.bookmarks || [])].filter(
        (x) => x.name !== collectionName,
      );
      dispatch({
        type: userActionTypes.UPDATE_BOOKMARK_SUCCESS,
        payload: {
          bookmarks: collections,
        },
      });
    } catch (e) {
      dispatch({
        type: userActionTypes.UPDATE_BOOKMARK_FAILURE,
        payload: {
          message: "Can't not add collection now!",
        },
      });
    }
  };
};
export const RemoveFromBookmarkCollectionRequest = (postId, collectionName) => {
  return async (dispatch) => {
    try {
      let collections = [...(store.getState().user.bookmarks || [])];
      if (collectionName !== 'All Posts') {
        const index = collections.findIndex((x) => x.name === collectionName);
        if (index > -1) {
          const collection = Object.assign({}, collections[index]);
          const index2 = collection.bookmarks.findIndex(
            (x) => x.postId === postId,
          );
          collection.bookmarks.splice(index2, 1);
          if (collection.avatarIndex === index2) {
            collection.avatarIndex = 0;
          }
          collections[index] = collection;
        }
      } else {
        collections = collections.map((collection) => {
          const index2 = collection.bookmarks.findIndex(
            (x) => x.postId === postId,
          );
          collection.bookmarks.splice(index2, 1);
          if (
            collection.avatarIndex === index2 &&
            collection.bookmarks.length > 0
          ) {
            collection.avatarIndex = 0;
          }
          return Object.assign({}, collection);
        });
      }
      collections = collections.filter((x) => x.bookmarks.length > 0);
      dispatch({
        type: userActionTypes.UPDATE_BOOKMARK_SUCCESS,
        payload: {
          bookmarks: collections,
        },
      });
    } catch (e) {
      dispatch({
        type: userActionTypes.UPDATE_BOOKMARK_FAILURE,
        payload: {
          message: "Can't not add collection now!",
        },
      });
    }
  };
};
export const MoveBookmarkToCollectionRequest = (
  fromCollectionName,
  targetCollectionName,
  postId,
) => {
  return async (dispatch) => {
    try {
      const collections = [...(store.getState().user.bookmarks || [])];
      const fromCollectionIndex = collections.findIndex(
        (x) => x.name === fromCollectionName,
      );
      const targetCollectionIndex = collections.findIndex(
        (x) => x.name === targetCollectionName,
      );
      const fromBookmarkIndex = collections[
        fromCollectionIndex
      ].bookmarks.findIndex((x) => x.postId === postId);
      if (fromBookmarkIndex > -1) {
        const newFromCollection = Object.assign(
          {},
          collections[fromCollectionIndex],
        );
        const newTargetCollection = Object.assign(
          {},
          collections[targetCollectionIndex],
        );
        const bookmark = newFromCollection.bookmarks.splice(
          fromBookmarkIndex,
          1,
        )[0];
        if (
          newFromCollection.avatarIndex === fromBookmarkIndex &&
          newFromCollection.bookmarks.length > 0
        ) {
          newFromCollection.avatarIndex = 0;
        }
        if (!newTargetCollection.bookmarks.find((x) => x.postId === postId)) {
          newTargetCollection.bookmarks.push(bookmark);
        }
        collections[fromCollectionIndex] = newFromCollection;
        collections[targetCollectionIndex] = newTargetCollection;
        if (newFromCollection.bookmarks.length === 0) {
          collections.splice(fromCollectionIndex, 1);
        }
      }
      dispatch({
        type: userActionTypes.UPDATE_BOOKMARK_SUCCESS,
        payload: {
          bookmarks: collections,
        },
      });
    } catch (e) {
      dispatch({
        type: userActionTypes.UPDATE_BOOKMARK_FAILURE,
        payload: {
          message: "Can't not add collection now!",
        },
      });
    }
  };
};
export const AddBookmarkToCollectionRequest = (
  collectionName,
  bookmarkList,
) => {
  return async (dispatch) => {
    try {
      const collections = [...(store.getState().user.bookmarks || [])];
      const index = collections.findIndex((x) => x.name === collectionName);
      if (index > -1) {
        const collection = Object.assign({}, collections[index]);
        bookmarkList.map((bookmark) => {
          if (!collection.bookmarks.find((x) => x.postId === bookmark.postId)) {
            collection.bookmarks.push(Object.assign({}, bookmark));
          }
        });
        collections[index] = collection;
      }
      dispatch({
        type: userActionTypes.UPDATE_BOOKMARK_SUCCESS,
        payload: {
          bookmarks: collections,
        },
      });
    } catch (e) {
      dispatch({
        type: userActionTypes.UPDATE_BOOKMARK_FAILURE,
        payload: {
          message: "Can't not add collection now!",
        },
      });
    }
  };
};
export const UpdateBookmarkCollectionRequest = (
  collectionName,
  updatedCollection,
) => {
  return async (dispatch) => {
    try {
      const collections = [...(store.getState().user.bookmarks || [])];
      const index = collections.findIndex((x) => x.name === collectionName);
      if (index > -1) {
        const collection = Object.assign({}, updatedCollection);
        collections[index] = collection;
      }
      dispatch({
        type: userActionTypes.UPDATE_BOOKMARK_SUCCESS,
        payload: {
          bookmarks: collections,
        },
      });
    } catch (e) {
      dispatch({
        type: userActionTypes.UPDATE_BOOKMARK_FAILURE,
        payload: {
          message: "Can't not add collection now!",
        },
      });
    }
  };
};
//Archive Actions
export const FetchArchiveRequest = () => {
  return async (dispatch) => {
    try {
      const ref = firestore();
      const myUsername = `${store.getState().user.user.userInfo?.username}`;
      const rq = await ref.collection('users').doc(myUsername).get();
      const userData = rq.data();
      dispatch({
        type: userActionTypes.FETCH_ARCHIVE_SUCCESS,
        payload: {
          archive: Object.assign(
            {},
            userData.archive || {
              posts: [],
              stories: [],
            },
          ),
        },
      });
    } catch (e) {}
  };
};
export const AddStoryArchiveRequest = (storyList) => {
  return async (dispatch) => {
    try {
      const ref = firestore();
      const myUsername = `${store.getState().user.user.userInfo?.username}`;
      const storyArchiveList = [
        ...(store.getState().user.archive?.stories || []),
      ];
      const postArchiveList = [...(store.getState().user.archive?.posts || [])];
      storyList.map((story) => {
        if (!storyArchiveList.find((x) => x.uid === story.uid)) {
          storyArchiveList.push(story);
        }
      });
      const rq = await ref.collection('users').doc(myUsername).get();
      if (rq.exists) {
        await rq.ref.update({
          archive: {
            stories: storyArchiveList,
            posts: postArchiveList,
          },
        });
      }
      dispatch(FetchArchiveRequest());
    } catch (e) {}
  };
};
export const AddPostArchiveRequest = (postList) => {
  return async (dispatch) => {
    try {
      const ref = firestore();
      const myUsername = `${store.getState().user.user.userInfo?.username}`;
      const storyArchiveList = [
        ...(store.getState().user.archive?.stories || []),
      ];
      const postArchiveList = [...(store.getState().user.archive?.posts || [])];
      postList.map((post) => {
        if (!postArchiveList.find((x) => x.uid === post.uid)) {
          postArchiveList.push(post);
        }
      });
      const rq = await ref.collection('users').doc(myUsername).get();
      if (rq.exists) {
        await rq.ref.update({
          archive: {
            stories: storyArchiveList,
            posts: postArchiveList,
          },
        });
      }
      dispatch(FetchArchiveRequest());
    } catch (e) {
      dispatch({
        type: userActionTypes.UPDATE_STORY_ARCHIVE_FAILURE,
        payload: {
          message: "Can't not add to archive!",
        },
      });
    }
  };
};
export const RemovePostArchiveRequest = (uid) => {
  return async (dispatch) => {
    try {
      const ref = firestore();
      const myUsername = `${store.getState().user.user.userInfo?.username}`;
      const storyArchiveList = [
        ...(store.getState().user.archive?.stories || []),
      ];
      const postArchiveList = [...(store.getState().user.archive?.posts || [])];
      const index = postArchiveList.findIndex((x) => x.uid === uid);
      postArchiveList.splice(index, 1);
      const rq = await ref.collection('users').doc(myUsername).get();
      if (rq.exists) {
        await rq.ref.update({
          archive: {
            stories: storyArchiveList,
            posts: postArchiveList,
          },
        });
      }
      dispatch(FetchArchiveRequest());
    } catch (e) {
      dispatch({
        type: userActionTypes.UPDATE_STORY_ARCHIVE_FAILURE,
        payload: {
          message: "Can't not remove to archive!",
        },
      });
    }
  };
};
//Highlight actions
export const FetchHighlightRequest = () => {
  return async (dispatch) => {
    try {
      const ref = firestore();
      const myUsername = `${store.getState().user.user.userInfo?.username}`;
      const rq = await ref.collection('users').doc(myUsername).get();
      const userData = rq.data();
      const highlights = (userData.highlights || []).filter(
        (x) => x.stories.length > 0,
      );
      dispatch({
        type: userActionTypes.FETCH_HIGHLIGHT_SUCCESS,
        payload: {
          highlights,
        },
      });
    } catch (e) {}
  };
};
export const AddStoryToHighlightRequest = (
  storyList,
  targetHighlightName,
  avatarUri,
) => {
  return async (dispatch) => {
    try {
      const ref = firestore();
      const myUsername = `${store.getState().user.user.userInfo?.username}`;
      const rq = await ref.collection('users').doc(`${myUsername}`).get();
      const currentHighLight = [...(store.getState().user.highlights || [])];
      const index = currentHighLight.findIndex(
        (x) => x.name === targetHighlightName,
      );
      if (index > -1 && rq.exists) {
        const highlight = Object.assign({}, currentHighLight[index]);
        const stories = [...highlight.stories];
        storyList.map((story) => {
          if (!stories.find((x) => x.uid === story.uid)) {
            stories.push(story);
          }
        });
        currentHighLight[index] = Object.assign(Object.assign({}, highlight), {
          stories,
        });
      } else if (avatarUri && index < 0) {
        currentHighLight.push({
          name: targetHighlightName,
          avatarUri,
          stories: storyList,
        });
      }
      await rq.ref.update({
        highlights: currentHighLight,
      });
      dispatch(AddStoryArchiveRequest(storyList));
      dispatch(FetchHighlightRequest());
    } catch (e) {
      dispatch({
        type: userActionTypes.FETCH_HIGHLIGHT_FAILURE,
        payload: {
          message: 'Load highlights failed',
        },
      });
    }
  };
};
export const RemoveFromHighlightRequest = (uid, targetHighlightName) => {
  return async (dispatch) => {
    try {
      const ref = firestore();
      const myUsername = `${store.getState().user.user.userInfo?.username}`;
      const rq = await ref.collection('users').doc(`${myUsername}`).get();
      const currentHighLight = [...(store.getState().user.highlights || [])];
      const index = currentHighLight.findIndex(
        (x) => x.name === targetHighlightName,
      );
      if (index > -1) {
        const highlight = Object.assign({}, currentHighLight[index]);
        const stories = [...highlight.stories];
        highlight.stories = stories.filter((x) => x.uid !== uid);
        if (highlight.stories.length === 0) {
          currentHighLight.splice(index, 1);
        } else {
          currentHighLight[index] = highlight;
        }
        await rq.ref.update({
          highlights: currentHighLight,
        });
        dispatch(FetchHighlightRequest());
      }
    } catch (e) {
      dispatch({
        type: userActionTypes.FETCH_HIGHLIGHT_FAILURE,
        payload: {
          message: 'Remove failed!',
        },
      });
    }
  };
};
export const RemoveHighlightRequest = (targetHighlightName) => {
  return async (dispatch) => {
    try {
      const ref = firestore();
      const myUsername = `${store.getState().user.user.userInfo?.username}`;
      const rq = await ref.collection('users').doc(`${myUsername}`).get();
      const currentHighLight = [...(store.getState().user.highlights || [])];
      const index = currentHighLight.findIndex(
        (x) => x.name === targetHighlightName,
      );
      if (index > -1) {
        currentHighLight.splice(index, 1);
        await rq.ref.update({
          highlights: currentHighLight,
        });
        dispatch(FetchHighlightRequest());
      }
    } catch (e) {
      dispatch({
        type: userActionTypes.FETCH_HIGHLIGHT_FAILURE,
        payload: {
          message: 'Remove failed!',
        },
      });
    }
  };
};
export const EditHighlightRequest = (editedHighlight, targetHighlightName) => {
  return async (dispatch) => {
    try {
      const ref = firestore();
      const myUsername = `${store.getState().user.user.userInfo?.username}`;
      const rq = await ref.collection('users').doc(`${myUsername}`).get();
      const currentHighLight = [...(store.getState().user.highlights || [])];
      const index = currentHighLight.findIndex(
        (x) => x.name === targetHighlightName,
      );
      if (index > -1) {
        currentHighLight[index] = Object.assign({}, editedHighlight);
        await rq.ref.update({
          highlights: currentHighLight,
        });
        dispatch(FetchHighlightRequest());
      }
    } catch (e) {
      dispatch({
        type: userActionTypes.FETCH_HIGHLIGHT_FAILURE,
        payload: {
          message: 'Remove failed!',
        },
      });
    }
  };
};
