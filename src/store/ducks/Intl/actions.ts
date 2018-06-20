import { createStandardAction } from 'typesafe-actions';
import types from './types';

const updateLocale = createStandardAction(types.UPDATE_LOCALE)<{
  locale: string;
}>();

export default {
  updateLocale
};
