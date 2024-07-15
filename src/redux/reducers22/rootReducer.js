import {combineReducers} from 'redux';
import auth from './auth/reducer';
import highlight from './highlight/reducer';
import post from './post/reducer';
import profile from './profile/reducer';

const rootReducer = combineReducers({
  auth,
  highlight,
  post,
  profile,
});

export default rootReducer;
