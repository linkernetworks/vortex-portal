import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './ducks';

const initialState = {};
const enhancers: Array<any> = [];
const middlewares: Array<any> = [thunk];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

const composeEnhancers = composeWithDevTools(
  applyMiddleware(...middlewares),
  ...enhancers
);

export default function configureStore() {
  return createStore(rootReducer, initialState, composeEnhancers);
}
