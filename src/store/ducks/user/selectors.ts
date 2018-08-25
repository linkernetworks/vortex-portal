import { UserStateType } from './index';
import { omit } from 'lodash';

export const flatUsers = (ducks: UserStateType) => {
  return ducks.users.map(user => {
    return {
      ...omit(user, ['loginCredential']),
      username: user.loginCredential.username,
      password: user.loginCredential.password
    };
  });
};
