import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faServer,
  faPlug,
  faDatabase
} from '@fortawesome/free-solid-svg-icons';

import './styles/index.scss';

import { default as appRoutes } from '@/routes';
import configureStore, { history } from '@/store/configureStore';
import registerServiceWorker from '@/registerServiceWorker';
import LocaleContainer from '@/containers/LocaleContainer';
import { userActions } from '@/store/ducks/user';
import { findAndVerifySavedAuthToken, removeToken } from '@/utils/auth';
import '@/services/request'; // set token header

const store = configureStore();
library.add(faServer, faPlug, faDatabase);

ReactDOM.render(
  <Provider store={store}>
    <LocaleContainer>
      <ConnectedRouter history={history}>{appRoutes}</ConnectedRouter>
    </LocaleContainer>
  </Provider>,
  document.getElementById('root') as HTMLElement
);

findAndVerifySavedAuthToken()
  .then(payload => {
    store.dispatch(userActions.login.success(payload));
  })
  .catch(() => {
    removeToken();
  });

if (module.hot) {
  module.hot.accept();
}

registerServiceWorker();
