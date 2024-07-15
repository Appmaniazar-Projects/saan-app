import {Alert} from 'react-native';
import {commentActionTypes} from './types';

const defaultState = {
  comments: [],
  post: {},
  scrollDown: false,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case commentActionTypes.FETCH_COMMENTS_REQUEST:
      state = {...defaultState};
      return state;
    case commentActionTypes.FETCH_COMMENTS_SUCCESS:
      action = action;
      state = {...action.payload};
      return state;
    case commentActionTypes.FETCH_COMMENTS_FAILURE:
      action = action;
      const message = action.payload.message;
      Alert.alert('Error', message);
      return state;
    case commentActionTypes.LOAD_MORE_COMMENTS_REQUEST:
      state = {...defaultState};
      return state;
    case commentActionTypes.LOAD_MORE_COMMENTS_SUCCESS:
      action = action;
      state = {
        ...state,
        comments: [...state.comments, ...action.payload.comments],
        scrollDown: action.payload.scrollDown || false,
      };
      return state;
    case commentActionTypes.LOAD_MORE_COMMENTS_FAILURE:
      action = action;
      const message2 = action.payload.message;
      Alert.alert('Error', message2);
      return state;
    case commentActionTypes.TOGGLE_LIKE_COMMENT_REQUEST:
      state = state;
      return state;
    case commentActionTypes.TOGGLE_LIKE_COMMENT_SUCCESS:
      action = action;
      state = {
        ...state,
        comments: [...action.payload.comments],
      };
      return state;
    case commentActionTypes.TOGGLE_LIKE_COMMENT_FAILURE:
      action = action;
      const message3 = action.payload.message;
      Alert.alert('Error', message3);
      return state;
    case commentActionTypes.TOGGLE_LIKE_REPLY_REQUEST:
      state = state;
      return state;
    case commentActionTypes.TOGGLE_LIKE_REPLY_SUCCESS:
      action = action;
      state = {
        ...state,
        comments: [...action.payload.comments],
      };
      return state;
    case commentActionTypes.TOGGLE_LIKE_REPLY_FAILURE:
      action = action;
      const message4 = action.payload.message;
      Alert.alert('Error', message4);
      return state;
    case commentActionTypes.REPLY_COMMENT_REQUEST:
      state = state;
      return state;
    case commentActionTypes.REPLY_COMMENT_SUCCESS:
      action = action;
      state = {
        ...state,
        comments: [...action.payload.comments],
      };
      return state;
    case commentActionTypes.REPLY_COMMENT_FAILURE:
      action = action;
      const message5 = action.payload.message;
      Alert.alert('Error', message5);
      return state;
    default:
      return state;
  }
};
export default reducer;
