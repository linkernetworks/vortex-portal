import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

// import App from './routes/App';
import './styles/index.scss';

import configureStore, { history } from './store/configureStore';
import registerServiceWorker from './registerServiceWorker';

import { Switch, Redirect } from 'react-router';

import { RouteWithLayout } from './routes/index';

import MainLayout from '@/layouts/MainLayout';
import Node from '@/routes/Compute/Node';
import Overview from '@/routes/Compute/Overview';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Redirect exact={true} from="/" to="/compute/overview" />
        <Redirect exact={true} from="/compute" to="/compute/overview" />
        <RouteWithLayout
          layout={MainLayout}
          component={Overview}
          path="/compute/overview"
        />
        <RouteWithLayout
          layout={MainLayout}
          component={Node}
          path="/compute/node"
        />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
