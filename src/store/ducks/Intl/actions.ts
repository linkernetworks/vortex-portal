import { createStandardAction } from 'typesafe-actions';
import types from './types';

const updateLocale = createStandardAction(types.UPDATE_LOCALE)<{
  locale: string;
}>();

const updateLocaleOptions = createStandardAction(types.UPDATE_LOCALE_OPTIONS)<{
  options: Array<{
    code: string;
    displayName: string;
  }>;
}>();

export default {
  updateLocale,
  updateLocaleOptions
};
