import { combineReducers } from 'redux';
import {
  routerReducer,
  RouterState,
  RouterAction,
  LocationChangeAction
} from 'react-router-redux';

import {
  default as enthusiasm,
  EnthusiasmActionType,
  EnthusiasmStateType
} from './enthusiasm';

import { default as intl, IntlActionType, IntlStateType } from './intl';

import {
  default as network,
  NetworkActionType,
  NetworkStateType
} from './network';

export interface RootState {
  router: RouterState;
  enthusiasm: EnthusiasmStateType;
  intl: IntlStateType;
  network: NetworkStateType;
}

type ReactRouterAction = RouterAction | LocationChangeAction;
export type RootAction =
  | ReactRouterAction
  | EnthusiasmActionType
  | IntlActionType
  | NetworkActionType;

export default combineReducers<RootState>({
  router: routerReducer,
  enthusiasm,
  intl,
  network
});
