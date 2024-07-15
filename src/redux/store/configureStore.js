/* eslint-disable global-require */
/* eslint-disable no-undef */
// import {createStore, applyMiddleware, compose} from 'redux';
// import thunk from 'redux-thunk';
// import {persistStore, persistReducer} from 'redux-persist';
// import AsyncStorage from '@react-native-community/async-storage';
// import rootReducer from '../reducers/rootReducer';

// // let middleware = [thunk, apiMiddleware];

// let middleware = [thunk];
// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   // blacklist: ['auth'],
// };

// middleware = [...middleware];

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = createStore(
//   persistedReducer,
//   compose(applyMiddleware(...middleware)),
// );

// const persistor = persistStore(store);

// export {store as default, persistor};

import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'],
};
import rootReducer from '../reducers/rootReducer';

const persistedReducer = persistReducer(persistConfig, rootReducer);

import thunk from 'redux-thunk';
const middlewares = [thunk];
const enhancers = [applyMiddleware(...middlewares)];
export const store = createStore(persistedReducer, compose(...enhancers));
export const persistor = persistStore(store);
