import { applyMiddleware, createStore, Middleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';

import rootReducer from './ducks';

const initialState = {};
export const history = createHistory();

const enhancers: Array<any> = [];
const middlewares: Array<Middleware> = [thunk, routerMiddleware(history)];

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
