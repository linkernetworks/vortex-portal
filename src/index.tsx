import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faServer, faPlug } from '@fortawesome/free-solid-svg-icons';

import './styles/index.scss';

import { default as appRoutes } from './routes';
import configureStore, { history } from './store/configureStore';
import registerServiceWorker from './registerServiceWorker';
import LocaleContainer from '@/containers/LocaleContainer';

const store = configureStore();
library.add(faServer, faPlug);

ReactDOM.render(
  <Provider store={store}>
    <LocaleContainer>
      <ConnectedRouter history={history}>{appRoutes}</ConnectedRouter>
    </LocaleContainer>
  </Provider>,
  document.getElementById('root') as HTMLElement
);

if (module.hot) {
  module.hot.accept();
}

registerServiceWorker();
