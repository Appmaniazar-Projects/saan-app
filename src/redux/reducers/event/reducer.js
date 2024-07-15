import {Alert} from 'react-native';
import {eventActionTypes} from './types';

const defaultState = {
  opportunity: [],
  events: [],
  eventComments: [],
  board: {},
  calendar: [],
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case eventActionTypes.FETCH_NOTICE_BOARD_REQUEST:
      state = {
        ...state,
        board: {},
      };
      return state;
    case eventActionTypes.FETCH_NOTICE_BOARD_SUCCESS:
      state = {
        ...state,
        board: action.payload,
      };
      return state;
    case eventActionTypes.FETCH_NOTICE_BOARD_FAILURE:
      //   const message = action.payload.message;
      Alert.alert('Error', action.payload.message);
      return state;

    case eventActionTypes.FETCH_OPPORTUNITY_REQUEST:
      state = {
        ...state,
        opportunity: [],
      };
      return state;
    case eventActionTypes.FETCH_OPPORTUNITY_SUCCESS:
      state = {
        ...state,
        opportunity: action.payload,
      };
      return state;
    case eventActionTypes.FETCH_OPPORTUNITY_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;

    case eventActionTypes.LOAD_MORE_OPPORTUNITY_REQUEST:
      //   state = [...defaultState];
      return state;
    case eventActionTypes.LOAD_MORE_OPPORTUNITY_SUCCESS:
      const newList = state.opportunity.concat(action.payload);
      state = {
        ...state,
        opportunity: newList,
      };
      return state;
    case eventActionTypes.LOAD_MORE_OPPORTUNITY_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;

    case eventActionTypes.FETCH_EVENT_REQUEST:
      state = {
        ...state,
        events: [],
      };
      return state;
    case eventActionTypes.FETCH_EVENT_SUCCESS:
      state = {
        ...state,
        events: action.payload,
      };
      return state;
    case eventActionTypes.FETCH_EVENT_FAILURE:
      // const message = action.payload.message;
      Alert.alert('Error', action.payload.message);
      return state;

    case eventActionTypes.LOAD_MORE_EVENT_REQUEST:
      //   state = [...defaultState];
      return state;
    case eventActionTypes.LOAD_MORE_EVENT_SUCCESS:
      const newList2 = state.opportunity.concat(action.payload);
      state = {
        ...state,
        events: newList2,
      };
      return state;
    case eventActionTypes.LOAD_MORE_EVENT_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;

    case eventActionTypes.CEREATE_EVENT_REQUEST:
      return state;
    case eventActionTypes.CEREATE_EVENT_SUCCESS:
      Alert.alert('Success', 'Event created successfully');
      return state;
    case eventActionTypes.CEREATE_EVENT_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;

    case eventActionTypes.LOAD_EVENT_CALENDAR_REQUEST:
      state = {
        ...state,
        calendar: [],
      };
      return state;
    case eventActionTypes.LOAD_EVENT_CALENDAR_SUCCESS:
      state = {
        ...state,
        calendar: action.payload,
      };
      return state;
    case eventActionTypes.LOAD_EVENT_CALENDAR_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;

    case eventActionTypes.EVENT_COMMENT_POST_REQUEST:
      return state;
    case eventActionTypes.EVENT_COMMENT_POST_SUCCESS:
      action = action;
      // state = [...action.payload];
      return state;
    case eventActionTypes.EVENT_COMMENT_POST_FAILURE:
      action = action;
      const message3 = action.payload.message;
      Alert.alert('Error', message3);
      return state;

    case eventActionTypes.FETCH_EVENT_COMMENTS_REQUEST:
      state = {...state, eventComments: []};
      return state;
    case eventActionTypes.FETCH_EVENT_COMMENTS_SUCCESS:
      action = action;
      state = {...state, eventComments: action.payload.comments};
      return state;
    case eventActionTypes.FETCH_EVENT_COMMENTS_FAILURE:
      action = action;
      const message = action.payload.message;
      Alert.alert('Error', message);
      return state;
    case eventActionTypes.LOAD_MORE_EVENT_COMMENTS_REQUEST:
      // state = {...defaultState};
      return state;
    case eventActionTypes.LOAD_MORE_EVENT_COMMENTS_SUCCESS:
      action = action;
      state = {
        ...state,
        eventComments: [...state.eventComments, ...action.payload.comments],
        scrollDown: action.payload.scrollDown || false,
      };
      return state;
    case eventActionTypes.LOAD_MORE_EVENT_COMMENTS_FAILURE:
      action = action;
      const message2 = action.payload.message;
      Alert.alert('Error', message2);
      return state;
    default:
      return state;
  }
};
export default reducer;
