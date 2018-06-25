import { createStandardAction } from 'typesafe-actions';
import { Locale, IntlOption } from './models';

const updateLocale = createStandardAction('UPDATE_LOCALE')<Locale>();

const updateLocaleOptions = createStandardAction('UPDATE_LOCALE_OPTIONS')<{
  options: Array<IntlOption>;
}>();

export default {
  updateLocale,
  updateLocaleOptions
};
