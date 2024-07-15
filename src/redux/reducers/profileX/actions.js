// import {firestore} from 'firebase';
import firestore from '@react-native-firebase/firestore';
import {store} from '../../store/configureStore';
import {userXActionTypes} from './types';
export const FetchProfileXRequest = (username) => {
  return async (dispatch) => {
    try {
      const myUsername = store.getState().user.user.userInfo?.username || '';
      const ref = firestore();
      const rq = await ref.collection('users').doc(username).get();
      const me = await ref.collection('users').doc(myUsername).get();
      if (rq.exists) {
        const data = rq.data() || {};
        const myUserData = me.data() || {};
        const myBlockList =
          myUserData.privacySetting?.blockedAccounts?.blockedAccounts || [];
        if (
          (data.privacySetting?.blockedAccounts?.blockedAccounts || []).indexOf(
            myUsername,
          ) > -1 ||
          myBlockList.indexOf(username) > -1
        ) {
          data.isBlock = true;
        } else {
          data.isBlock = false;
        }
        const photos = await ref
          .collection('posts')
          .where('userId', '==', username)
          .orderBy('create_at', 'desc')
          .get();
        const tagPhotos = await ref
          .collection('posts')
          .where('tagUsername', 'array-contains', username)
          .orderBy('create_at', 'desc')
          .get();
        data.posts = photos.docs.map((x) => x.data() || {});
        data.tagPhotos = tagPhotos.docs.map((x) => x.data() || {});
        const followers = await ref
          .collection('users')
          .where('followings', 'array-contains', username)
          .get();
        data.followers = followers.docs.map((x) => x.data().username) || [];
        const index = data.followers.indexOf(username);
        if (index > -1) {
          data.followers.splice(index, 1);
        }
        data.mutualFollowings = (data.followings || []).filter(
          (usr) =>
            (myUserData.followings || []).indexOf(usr) > -1 &&
            usr !== myUsername &&
            usr !== username,
        );
        dispatch(FetchProfileXSuccess(data));
      } else {
        dispatch(FetchProfileXFailure());
      }
    } catch (e) {
      console.log(e);
      dispatch(FetchProfileXFailure());
    }
  };
};
export const ResetProfileXRequest = () => {
  return async (dispatch) => {
    dispatch(FetchProfileXSuccess({}));
  };
};
export const FetchProfileXFailure = () => {
  return {
    type: userXActionTypes.FETCH_PROFILEX_FAILURE,
    payload: {
      message: "This profile doesn't exists",
    },
  };
};
export const FetchProfileXSuccess = (payload) => {
  return {
    type: userXActionTypes.FETCH_PROFILEX_SUCCESS,
    payload: payload,
  };
};
