import { combineReducers } from 'redux';

import {
  default as enthusiasm,
  EnthusiasmActionType,
  EnthusiasmStateType
} from './enthusiasm';

export interface RootState {
  enthusiasm: EnthusiasmStateType;
}

export type RootAction = EnthusiasmActionType;

export default combineReducers<RootState>({
  enthusiasm
});
