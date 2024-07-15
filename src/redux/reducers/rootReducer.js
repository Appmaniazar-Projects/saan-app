import {combineReducers} from 'redux';
import userReducer from './user/reducer';
import storyReducer from './story/reducer';
import postReducer from './post/reducer';
import commentReducer from './comment/reducer';
import notificationReducer from './notification/reducer';
import profileXReducer from './profileX/reducer';
import messageReducer from './message/reducer';
import eventReducer from './event/reducer';

// export type AppState = {
//     user: userPayload;
//     storyList: StoryList;
//     postList: PostList;
//     comment: CommentExtraList;
//     notifications: NotificationList;
//     profileX: ProfileX;
//     messages: MessageList;
//   };

const rootReducer = combineReducers({
  user: userReducer,
  storyList: storyReducer,
  postList: postReducer,
  comment: commentReducer,
  notifications: notificationReducer,
  profileX: profileXReducer,
  messages: messageReducer,
  event: eventReducer,
});

export default rootReducer;
