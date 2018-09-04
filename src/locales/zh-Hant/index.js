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
import service from './service';
import namespace from './namespace';
import storage from './storage';
import volume from './volume';
import deployment from './deployment';

export default {
  'parentLocale': 'zh',
  'displayLocale': '繁體中文',
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
  ...hub,
  ...service,
  ...namespace,
  ...storage,
  ...volume,
  ...deployment,
};
