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

import { default as hub, HubActionType, HubStateType } from '@/store/ducks/hub';

import {
  default as storage,
  StorageActionType,
  StorageStateType
} from '@/store/ducks/storage';

import {
  default as volume,
  VolumeActionType,
  VolumeStateType
} from '@/store/ducks/volume';

import {
  default as user,
  UserActionType,
  UserStateType
} from '@/store/ducks/user';

export interface RootState {
  router: RouterState;
  intl: IntlStateType;
  cluster: ClusterStateType;
  network: NetworkStateType;
  hub: HubStateType;
  storage: StorageStateType;
  volume: VolumeStateType;
  user: UserStateType;
}

type ReactRouterAction = RouterAction | LocationChangeAction;
export type RootAction =
  | ReactRouterAction
  | IntlActionType
  | ClusterActionType
  | NetworkActionType
  | HubActionType
  | StorageActionType
  | VolumeActionType
  | UserActionType;

// Redux Thunk
export type RTDispatch = ThunkDispatch<RootState, undefined, RootAction>;
export type RTAction<R> = ThunkAction<R, RootState, undefined, RootAction>;

export const rootEpic = combineEpics();

export default combineReducers<RootState>({
  router: routerReducer,
  intl,
  cluster,
  network,
  hub,
  storage,
  volume,
  user
});
