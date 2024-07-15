import {Alert} from 'react-native';
import {notificationActionTypes} from './types';

const defaultState = [];

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case notificationActionTypes.FETCH_NOTIFICATIONS_REQUEST:
      state = [...defaultState];
      return state;
    case notificationActionTypes.FETCH_NOTIFICATIONS_SUCCESS:
      action = action;
      state = [...action.payload];
      return state;
    case notificationActionTypes.FETCH_NOTIFICATIONS_FAILURE:
      action = action;
      const message = action.payload.message;
      Alert.alert('Error', message);
      return state;
    default:
      return state;
  }
};
export default reducer;
