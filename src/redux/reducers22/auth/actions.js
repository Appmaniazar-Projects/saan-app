import {
  AUTH_CREATE_USER,
  AUTH_CREATE_USER_FAIL,
  AUTH_CREATE_USER_SUCCESS,
  AUTH_LOGIN_USER,
  AUTH_LOGIN_USER_FAIL,
  AUTH_LOGIN_USER_SUCCESS,
} from './types';
import firebase from 'firebase';
import moment from 'moment';
import * as RootNavigation from '../../../common/RootNavigation';
// import {Actions} from 'react-native-router-flux';

// export const loginWithMobile = (countryCode, mobile) => {};

// export const createUserMobile = (countryCode, mobile) => {};

export const createUser = (email, password, fullname = '') => {
  return (dispatch) => {
    dispatch({type: AUTH_CREATE_USER});

    const tmpString = email.split('@');
    const username = tmpString[0];

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => createUserSuccess(dispatch, user))
      .then(() => {
        const {currentUser} = firebase.auth();
        try {
          firebase
            .database()
            .ref(`/users/${currentUser.uid}/`)
            .set({
              profile: {
                name_profile: fullname !== '' ? fullname : username,
                email,
                username,
                password,
                userpic:
                  'https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png',
                posts_number: 0,
                followers: 0,
                following: 0,
                bio: null,
                sex: null,
                created_at: Math.round(moment().unix() / 1000, 0),
              },
            });
        } catch (error) {
          alert(error);
        }
      })
      .catch(() => createUserFail(dispatch));
  };
};

const createUserFail = (dispatch) => {
  dispatch({type: AUTH_CREATE_USER_FAIL});
};

const createUserSuccess = (dispatch, user) => {
  dispatch({
    type: AUTH_CREATE_USER_SUCCESS,
    payload: user,
  });

  RootNavigation.replace('DrawerStack');
};

export const loginUser = (email, password) => {
  return (dispatch) => {
    dispatch({type: AUTH_LOGIN_USER});
    console.log('loginUser');
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log('loginUser', user);
        loginUserSuccess(dispatch, user);
      })
      .catch(() => loginUserFail(dispatch));
  };
};

const loginUserFail = (dispatch) => {
  console.log('loginUserFail');
  dispatch({type: AUTH_LOGIN_USER_FAIL});
};

const loginUserSuccess = (dispatch, user) => {
  console.log('loginUserSuccess', user);
  dispatch({
    type: AUTH_LOGIN_USER_SUCCESS,
    payload: user,
  });
  RootNavigation.replace('DrawerStack');
};

export const logoutUser = () => {
  return (dispatch) => {
    dispatch({type: AUTH_LOGIN_USER});
    console.log('logoutUser');
    firebase
      .auth()
      .signOut()
      .then((res) => {
        console.log('signOut', res);
        loginUserSuccess(dispatch, null);
        RootNavigation.replace('LoginStack');
      })
      .catch((error) => {
        alert(error);
      });
  };
};
