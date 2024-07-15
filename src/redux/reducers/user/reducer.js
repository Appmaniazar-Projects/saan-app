import {Alert} from 'react-native';
import {defaultUserState, userActionTypes} from './types';

const reducer = (state = defaultUserState, action) => {
  switch (action.type) {
    case userActionTypes.LOGIN_REQUEST:
      state = {...state, user: {}};
      return state;
    case userActionTypes.LOGIN_SUCCESS:
      action = action;
      state = {...state, user: {...action.payload.user}};
      return state;
    case userActionTypes.LOGIN_FAILURE:
      action = action;
      const message = action.payload.message;
      Alert.alert('Error', message);
      return state;
    case userActionTypes.LOGOUT_SUCCESS:
      return {user: {}};
    case userActionTypes.LOGOUT_FAILURE:
      action = action;
      Alert.alert('Error', action.payload.message);
      return state;
    case userActionTypes.REGISTER_REQUEST:
      state = {...state, user: {}};
      return state;
    case userActionTypes.REGISTER_SUCCESS:
      action = action;
      state = {...state, user: {...action.payload.user}};
      return state;
    case userActionTypes.REGISTER_FAILURE:
      action = action;
      const message2 = action.payload.message;
      Alert.alert('Error', message2);
      return state;
    case userActionTypes.UNFOLLOW_REQUEST:
      state = {...state, user: {}};
      return state;
    case userActionTypes.UNFOLLOW_SUCCESS:
      action = action;
      state = {
        ...state,
        user: {
          ...state.user,
          userInfo: {
            ...state.user.userInfo,
            followings: action.payload.followings || [],
          },
        },
        extraInfo: {
          ...state.extraInfo,
          followings: action.payload.followings || [],
        },
      };
      return state;
    case userActionTypes.UNFOLLOW_FAILURE:
      action = action;
      const message3 = action.payload.message;
      Alert.alert('Error', message3);
      return state;
    case userActionTypes.FOLLOW_REQUEST:
      state = {...state, user: {}};
      return state;
    case userActionTypes.FOLLOW_SUCCESS:
      action = action;
      state = {
        ...state,
        user: {...state.user, userInfo: {...action.payload}},
        extraInfo: {
          ...state.extraInfo,
          followings: action.payload.followings || [],
        },
      };
      return state;
    case userActionTypes.FOLLOW_FAILURE:
      action = action;
      Alert.alert('Error', action.payload.message);
      return state;
    case userActionTypes.FETCH_EXTRA_INFO_REQUEST:
      state = {...state};
      return state;
    case userActionTypes.FETCH_EXTRA_INFO_SUCCESS:
      action = action;
      state = {
        ...state,
        currentStory: [...action.payload.currentStory],
        extraInfo: {...action.payload.extraInfo},
        photos: [...action.payload.photos],
        tagPhotos: [...action.payload.tagPhotos],
      };
      return state;
    case userActionTypes.FETCH_EXTRA_INFO_FAILURE:
      action = action;
      const message4 = action.payload.message;
      Alert.alert('Error', message4);
      return state;
    case userActionTypes.UPDATE_NOTIFICATION_SETTING_REQUEST:
      state = {...state};
      return state;
    case userActionTypes.UPDATE_NOTIFICATION_SETTING_SUCCESS:
      action = action;
      state = {
        ...state,
        setting: {
          ...state.setting,
          notification: {
            ...state.setting?.notification,
            ...action.payload,
          },
        },
      };
      return state;
    case userActionTypes.UPDATE_NOTIFICATION_SETTING_FAILURE:
      action = action;
      Alert.alert('Error', action.payload.message);
      return state;
    case userActionTypes.UPDATE_PRIVACY_SETTING_REQUEST:
      state = {...state};
      return state;
    case userActionTypes.UPDATE_PRIVACY_SETTING_SUCCESS:
      action = action;
      state = {
        ...state,
        setting: {
          ...state.setting,
          privacy: {
            ...state.setting?.privacy,
            ...action.payload,
          },
        },
      };
      return state;
    case userActionTypes.UPDATE_PRIVACY_SETTING_FAILURE:
      action = action;
      Alert.alert('Error', action.payload.message);
      return state;
    case userActionTypes.UPDATE_USER_INFO_REQUEST:
      state = {...state};
      return state;
    case userActionTypes.UPDATE_USER_INFO_SUCCESS:
      action = action;
      state = {
        ...state,
        user: {
          ...state.user,
          userInfo: {
            ...action.payload,
          },
        },
      };
      return state;
    case userActionTypes.UPDATE_USER_INFO_FAILURE:
      action = action;
      Alert.alert('Error', action.payload.message);
      return state;
    case userActionTypes.FETCH_SETTING_REQUEST:
      state = {...state};
      return state;
    case userActionTypes.FETCH_SETTING_SUCCESS:
      action = action;
      state = {
        ...state,
        setting: {
          ...action.payload,
        },
      };
      return state;
    case userActionTypes.FETCH_SETTING_FAILURE:
      action = action;
      Alert.alert('Error', action.payload.message);
      return state;
    case userActionTypes.FETCH_RECENT_SEARCH_SUCCESS:
      action = action;
      state = {
        ...state,
        user: {
          ...state.user,
          userInfo: {
            ...state.user.userInfo,
            searchRecent: action.payload,
          },
        },
      };
      return state;
    case userActionTypes.UPDATE_EXTRA_INFO_SUCCESS:
      action = action;
      state = {
        ...state,
        currentStory: [...action.payload.currentStory],
        extraInfo: {...action.payload.extraInfo},
        photos: [...action.payload.photos],
        tagPhotos: [...action.payload.tagPhotos],
      };
      return state;
    case userActionTypes.UPDATE_BOOKMARK_SUCCESS:
      action = action;
      state = {
        ...state,
        bookmarks: action.payload.bookmarks,
      };
      return state;
    case userActionTypes.UPDATE_BOOKMARK_FAILURE:
      action = action;
      Alert.alert('Error', action.payload.message);
      return state;
    case userActionTypes.UPDATE_STORY_ARCHIVE_SUCCESS:
      action = action;
      state = {
        ...state,
        archive: {
          posts: [...(state.archive?.posts || [])],
          stories: [...action.payload.stories],
        },
      };
      return state;
    case userActionTypes.UPDATE_STORY_ARCHIVE_FAILURE:
      action = action;
      Alert.alert('Error', action.payload.message);
      return state;
    case userActionTypes.UPDATE_POST_ARCHIVE_SUCCESS:
      action = action;
      state = {
        ...state,
        archive: {
          stories: [...(state.archive?.stories || [])],
          posts: [...action.payload.posts],
        },
      };
      return state;
    case userActionTypes.UPDATE_POST_ARCHIVE_FAILURE:
      action = action;
      Alert.alert('Error', action.payload.message);
      return state;
    case userActionTypes.FETCH_ARCHIVE_SUCCESS:
      action = action;
      if (action.payload) {
        state = {
          ...state,
          ...action.payload,
        };
      }
      return state;
    case userActionTypes.FETCH_ARCHIVE_FAILURE:
      action = action;
      Alert.alert('Error', action.payload.message);
      return state;
    case userActionTypes.FETCH_HIGHLIGHT_SUCCESS:
      action = action;
      if (action.payload) {
        state = {
          ...state,
          highlights: action.payload.highlights || [],
        };
      }
      return state;
    case userActionTypes.FETCH_HIGHLIGHT_FAILURE:
      action = action;
      Alert.alert('Error', action.payload.message);
      return state;
    case userActionTypes.SET_FCM_TOKEN:
      action = action;
      return {
        ...state,
        fcmToken: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;
