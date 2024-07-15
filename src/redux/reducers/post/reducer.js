import {postActionTypes} from './types';

const {Alert} = require('react-native');

const defaultState = [];

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case postActionTypes.FETCH_POST_LIST_REQUEST:
      state = [...defaultState];
      return state;
    case postActionTypes.FETCH_POST_LIST_SUCCESS:
      action = action;
      state = [...action.payload];
      return state;
    case postActionTypes.FETCH_POST_LIST_FAILURE:
      action = action;
      const message = action.payload.message;
      Alert.alert('Error', message);
      return state;
    case postActionTypes.LOAD_MORE_POST_LIST_REQUEST:
      state = [...defaultState];
      return state;
    case postActionTypes.LOAD_MORE_POST_LIST_SUCCESS:
      action = action;
      const newPostList = state.concat(action.payload);
      state = [...newPostList];
      return state;
    case postActionTypes.LOAD_MORE_POST_LIST_FAILURE:
      action = action;
      const message2 = action.payload.message;
      Alert.alert('Error', message2);
      return state;
    case postActionTypes.COMMENT_POST_REQUEST:
      return state;
    case postActionTypes.COMMENT_POST_SUCCESS:
      action = action;
      state = [...action.payload];
      return state;
    case postActionTypes.COMMENT_POST_FAILURE:
      action = action;
      const message3 = action.payload.message;
      Alert.alert('Error', message3);
      return state;
    case postActionTypes.TOGGLE_LIKE_POST_REQUEST:
      return state;
    case postActionTypes.TOGGLE_LIKE_POST_SUCCESS:
      action = action;
      state = [...action.payload];
      return state;
    case postActionTypes.TOGGLE_LIKE_POST_FAILURE:
      action = action;
      const message4 = action.payload.message;
      Alert.alert('Error', message4);
      return state;
    case postActionTypes.UPDATE_POST_REQUEST:
      return state;
    case postActionTypes.UPDATE_POST_SUCCESS:
      action = action;
      const updatedPost = action.payload;
      const postList = state.map((post) => {
        if (post.uid === updatedPost.uid) {
          return {...updatedPost};
        }
        return post;
      });
      state = [...postList];
      return state;
    case postActionTypes.UPDATE_POST_FAILURE:
      action = action;
      Alert.alert('Error', action.payload.message);
      return state;
    default:
      return state;
  }
};
export default reducer;
