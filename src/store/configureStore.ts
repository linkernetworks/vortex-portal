import { applyMiddleware, createStore, Middleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { createEpicMiddleware } from 'redux-observable';
import createHistory from 'history/createBrowserHistory';

import rootReducer, { rootEpic } from '@/store/ducks';

const initialState = {};
export const history = createHistory();

const epicMiddleware = createEpicMiddleware();

const enhancers: Array<any> = [];
const middlewares: Array<Middleware> = [
  routerMiddleware(history),
  thunk,
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

  // Hot reload reducers
  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('./ducks/index', () =>
        store.replaceReducer(require('./ducks/index').default)
      );
    }
  }

  epicMiddleware.run(rootEpic);
  return store;
}
