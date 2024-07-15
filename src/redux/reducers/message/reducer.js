import {Alert} from 'react-native';
import {messagesActionTypes} from './types';

const defaultState = [];

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case messagesActionTypes.TRIGGER_MESSAGES_LISTENER_REQUEST:
      state = [...defaultState];
      return state;
    case messagesActionTypes.TRIGGER_MESSAGES_LISTENER_SUCCESS:
      action = action;
      state = [...action.payload];
      return state;
    case messagesActionTypes.TRIGGER_MESSAGES_LISTENER_FAILURE:
      action = action;
      const message = action.payload.message;
      Alert.alert('Error', message);
      return state;
    default:
      return state;
  }
};
export default reducer;
