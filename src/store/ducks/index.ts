import { combineReducers } from 'redux';
import {
  routerReducer,
  RouterAction,
  LocationChangeAction
} from 'react-router-redux';

import {
  default as enthusiasm,
  EnthusiasmActionType,
  EnthusiasmStateType
} from './enthusiasm';

export interface RootState {
  enthusiasm: EnthusiasmStateType;
}

type ReactRouterAction = RouterAction | LocationChangeAction;
export type RootAction = ReactRouterAction | EnthusiasmActionType;

export default combineReducers<RootState>({
  router: routerReducer,
  enthusiasm
});
