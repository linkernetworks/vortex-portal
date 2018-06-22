import { ActionType, StateType, getType } from 'typesafe-actions';
import Intl from './actions';

export type IntlStateType = StateType<typeof intlReducer>;
export type IntlActionType = ActionType<typeof Intl>;

const initialState = {
  locale: 'en-US',
  options: []
};

export function intlReducer(state = initialState, action: IntlActionType) {
  if (state === undefined) {
    return initialState;
  }

  switch (action.type) {
    case getType(Intl.updateLocale): {
      console.log(action.payload.locale);
      return { ...state, ...action.payload };
    }
    case getType(Intl.updateLocaleOptions):
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
