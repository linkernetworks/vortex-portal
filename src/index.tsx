import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { enthusiasm } from './reducers/index';
import { StoreState } from './types/index';
import { Provider } from 'react-redux';
import { EnthusiasmAction } from './actions/index';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const store = createStore<StoreState, EnthusiasmAction, any, any>(enthusiasm, {
  enthusiasmLevel: 1,
  languageName: 'TypeScript'
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
