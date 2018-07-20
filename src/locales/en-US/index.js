import basic from './basic';
import nav from './nav';
import side from './side';
import user from './user';
import network from './network';
import action from './action';
import form from './form'

export default {
  'parentLocale': 'en',
  'displayLocale': 'English',
  ...basic,
  ...user,
  ...nav,
  ...action,
  ...form,
  ...side,
  ...network
};
