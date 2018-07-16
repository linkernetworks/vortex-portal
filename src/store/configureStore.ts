import { applyMiddleware, createStore, Middleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { createEpicMiddleware } from 'redux-observable';
import createHistory from 'history/createBrowserHistory';

import rootReducer, { rootEpic } from './ducks';

const initialState = {};
export const history = createHistory();

const epicMiddleware = createEpicMiddleware();

const enhancers: Array<any> = [];
const middlewares: Array<Middleware> = [
  thunk,
  routerMiddleware(history),
  epicMiddleware
];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

const composeEnhancers = composeWithDevTools(
  applyMiddleware(...middlewares),
  ...enhancers
);

export default function configureStore() {
  const store = createStore(rootReducer, initialState, composeEnhancers);
  epicMiddleware.run(rootEpic);
  return store;
}
