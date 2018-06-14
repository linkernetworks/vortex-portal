import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { LocaleProvider } from 'antd';
import { addLocaleData, IntlProvider } from 'react-intl';

import enUS from 'antd/lib/locale-provider/en_US';
import zhTW from 'antd/lib/locale-provider/zh_TW';

import './styles/index.scss';

import { default as appRoutes } from './routes';
import configureStore, { history } from './store/configureStore';
import registerServiceWorker from './registerServiceWorker';

const store = configureStore();
console.log(store);
ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={zhTW}>
      <ConnectedRouter history={history}>{appRoutes}</ConnectedRouter>
    </LocaleProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
