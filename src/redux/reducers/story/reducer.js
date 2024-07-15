import {Alert} from 'react-native';
import {storyActionTypes} from './types';

const defaultState = [];

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case storyActionTypes.FETCH_STORY_LIST_REQUEST:
      state = [...defaultState];
      return state;
    case storyActionTypes.FETCH_STORY_LIST_SUCCESS:
      action = action;
      state = [...action.payload];
      return state;
    case storyActionTypes.FETCH_STORY_LIST_FAILURE:
      action = action;
      const message = action.payload.message;
      Alert.alert('Error', message);
      return state;
    default:
      return state;
  }
};
export default reducer;
