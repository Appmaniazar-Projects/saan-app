export const seenTypes = {
  NOTSEEN: 0,
  SEEN: 1,
};
export const notificationTypes = {
  LIKE_MY_POST: 1,
  COMMENT_MY_POST: 2,
  REPLY_MY_COMMENT: 3,
  LIKE_MY_COMMENT: 4,
  LIKE_MY_REPLY: 5,
  FOLLOW_ME: 6,
  SOMEONE_POSTS: 7,
  SOMEONE_LIKE_SOMEONE_POST: 8,
  SOMEONE_COMMENT_SOMEONE_POST: 9,
};
export const notificationActionTypes = {
  FETCH_NOTIFICATIONS_REQUEST: 'FETCH_NOTIFICATIONS_REQUEST',
  FETCH_NOTIFICATIONS_SUCCESS: 'FETCH_NOTIFICATIONS_SUCCESS',
  FETCH_NOTIFICATIONS_FAILURE: 'FETCH_NOTIFICATIONS_FAILURE',
};