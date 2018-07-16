import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import {
  routerReducer,
  RouterState,
  RouterAction,
  LocationChangeAction
} from 'react-router-redux';

import { default as intl, IntlActionType, IntlStateType } from './intl';

import {
  default as network,
  NetworkActionType,
  NetworkStateType
} from './network';

import {
  default as cluster,
  ClusterActionType,
  ClusterStateType
} from './cluster';

export interface RootState {
  router: RouterState;
  intl: IntlStateType;
  cluster: ClusterStateType;
  network: NetworkStateType;
}

type ReactRouterAction = RouterAction | LocationChangeAction;
export type RootAction =
  | ReactRouterAction
  | IntlActionType
  | ClusterActionType
  | NetworkActionType;

export const rootEpic = combineEpics();

export default combineReducers<RootState>({
  router: routerReducer,
  intl,
  cluster,
  network
});
