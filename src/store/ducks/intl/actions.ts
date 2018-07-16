import { createStandardAction } from 'typesafe-actions';
import { Locale, IntlOption } from './models';

export const updateLocale = createStandardAction('UPDATE_LOCALE')<Locale>();

export const updateLocaleOptions = createStandardAction(
  'UPDATE_LOCALE_OPTIONS'
)<{
  options: Array<IntlOption>;
}>();
