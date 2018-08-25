import { RTAction } from '../index';
import { userActions, UserActionType } from './index';
import * as userAPI from '@/services/user';

export const fetchUsers = (): RTAction<Promise<UserActionType>> => {
  return async dispatch => {
    dispatch(userActions.fetchUsers.request());
    try {
      const res = await userAPI.getUsers();
      return dispatch(userActions.fetchUsers.success(res.data));
    } catch (e) {
      return dispatch(userActions.fetchUsers.failure(e.response.data));
    }
  };
};

export const removeUser = (id: string): RTAction<Promise<UserActionType>> => {
  return async dispatch => {
    dispatch(userActions.removeUser.request());
    try {
      const res = await userAPI.deleteUser(id);
      if (!res.data.error) {
        return dispatch(userActions.removeUser.success({ id }));
      } else {
        throw new Error(res.data.message);
      }
    } catch (e) {
      return dispatch(userActions.removeUser.failure(e.response.data));
    }
  };
};
