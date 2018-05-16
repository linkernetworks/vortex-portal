import { createStandardAction } from 'typesafe-actions';
import types from './types';

const incrementEnthusiasm = createStandardAction(types.INCREMENT_ENTHUSIASM)<
  void
>();

const decrementEnthusiasm = createStandardAction(types.DECREMENT_ENTHUSIASM)<
  void
>();

export default {
  incrementEnthusiasm,
  decrementEnthusiasm
};
