import { combineReducers } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { combineEpics } from 'redux-observable';
import {
  routerReducer,
  RouterState,
  RouterAction,
  LocationChangeAction
} from 'react-router-redux';

import {
  default as intl,
  IntlActionType,
  IntlStateType
} from '@/store/ducks/intl';

import {
  default as network,
  NetworkActionType,
  NetworkStateType
} from '@/store/ducks/network';

import {
  default as cluster,
  ClusterActionType,
  ClusterStateType
} from '@/store/ducks/cluster';

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

// Redux Thunk
export type RTDispatch = ThunkDispatch<RootState, undefined, RootAction>;
export type RTAction<R> = ThunkAction<R, RootState, undefined, RootAction>;

export const rootEpic = combineEpics();

export default combineReducers<RootState>({
  router: routerReducer,
  intl,
  cluster,
  network
});
