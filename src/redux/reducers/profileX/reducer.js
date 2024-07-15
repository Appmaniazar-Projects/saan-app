import {defaultUserState, userXActionTypes} from './types';

const reducer = (state = defaultUserState, action) => {
  switch (action.type) {
    case userXActionTypes.FETCH_PROFILEX_SUCCESS:
      action = action;
      state = {...action.payload};
      return state;
    default:
      return state;
  }
};

export default reducer;
