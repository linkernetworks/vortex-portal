import basic from './basic';
import nav from './nav';
import side from './side';
import user from './user';


export default {
  'parentLocale': 'en',
  'displayLocale': 'English',
  ...basic,
  ...user,
  ...nav,
  ...side,
};
