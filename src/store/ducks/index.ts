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

export interface RootState {
  router: RouterState;
  enthusiasm: EnthusiasmStateType;
  intl: IntlStateType;
}

type ReactRouterAction = RouterAction | LocationChangeAction;
export type RootAction =
  | ReactRouterAction
  | EnthusiasmActionType
  | IntlActionType;

export default combineReducers<RootState>({
  router: routerReducer,
  enthusiasm,
  intl
});
