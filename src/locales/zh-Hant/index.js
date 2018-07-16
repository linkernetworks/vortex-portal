import basic from './basic';
import nav from './nav';
import action from './action';
import side from './side';
import user from './user';

export default {
  'parentLocale': 'zh',
  'displayLocale': '繁體中文',
  ...basic,
  ...nav,
  ...action,
  ...side,
  ...user
};
