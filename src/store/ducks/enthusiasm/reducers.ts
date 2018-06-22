import { ActionType, getType } from 'typesafe-actions';
import Enthusiasm from './actions';

export type EnthusiasmStateType = Readonly<{
  languageName: string;
  enthusiasmLevel: number;
}>;

export type EnthusiasmActionType = ActionType<typeof Enthusiasm>;

const inititalState: EnthusiasmStateType = {
  languageName: 'typescript',
  enthusiasmLevel: 1
};

export function enthusiasm(
  state = inititalState,
  action: EnthusiasmActionType
) {
  if (state === undefined) {
    return inititalState;
  }

  switch (action.type) {
    case getType(Enthusiasm.incrementEnthusiasm):
      return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
    case getType(Enthusiasm.decrementEnthusiasm):
      return {
        ...state,
        enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1)
      };
    default:
      return state;
  }
}
