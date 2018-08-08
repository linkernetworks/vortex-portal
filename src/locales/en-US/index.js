import basic from './basic';
import nav from './nav';
import side from './side';
import user from './user';
import auth from './auth';
import network from './network';
import action from './action';
import form from './form'
import node from './node';
import pod from './pod';
import container from './container';
import hub from './hub';

export default {
  'parentLocale': 'en',
  'displayLocale': 'English',
  ...basic,
  ...user,
  ...auth,
  ...nav,
  ...action,
  ...form,
  ...side,
  ...network,
  ...node,
  ...pod,
  ...container,
  ...hub
};
