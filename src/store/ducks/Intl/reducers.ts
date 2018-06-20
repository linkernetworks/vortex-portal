import { ActionsUnion, getType } from 'typesafe-actions';
import Intl from './actions';

export type IntlStateType = Readonly<{
  locale: string;
}>;

export type IntlActionType = ActionsUnion<typeof Intl>;

const initialState: IntlStateType = {
  locale: 'en-US'
};

export function intlReducer(state = initialState, action: IntlActionType) {
  if (state === undefined) {
    return initialState;
  }

  switch (action.type) {
    case getType(Intl.updateLocale):
      return { ...state, locale: action.payload.locale };
    default:
      return state;
  }
}
