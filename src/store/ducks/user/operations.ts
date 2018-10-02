import * as jwtDecode from 'jwt-decode';
import { RTAction } from '../index';
import { userActions, UserActionType } from './index';
import * as userAPI from '@/services/user';
import { LoginCredential, UserBrief } from '@/models/User';
import { saveToken } from '@/utils/auth';

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

export const addUser = (data: UserBrief): RTAction<Promise<UserActionType>> => {
  return async dispatch => {
    dispatch(userActions.addUser.request());
    try {
      const res = await userAPI.createUser(data);
      return dispatch(userActions.addUser.success(res.data));
    } catch (e) {
      return dispatch(userActions.addUser.failure(e.response.data));
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

export const changePassword = (
  data: LoginCredential
): RTAction<Promise<UserActionType>> => {
  return async dispatch => {
    dispatch(userActions.changePassword.request());
    try {
      const res = await userAPI.updatePassword(data);
      if (!res.data.error) {
        return dispatch(userActions.changePassword.success(data));
      } else {
        throw new Error(res.data.message);
      }
    } catch (e) {
      return dispatch(userActions.changePassword.failure(e.response.data));
    }
  };
};

export const login = (
  data: LoginCredential
): RTAction<Promise<UserActionType>> => {
  return async dispatch => {
    dispatch(userActions.login.request());
    try {
      const res = await userAPI.signin(data);
      const token = res.data.message;
      saveToken(token);
      const decode: any = jwtDecode(token);
      const user = await userAPI.getUser(decode.sub);
      return dispatch(
        userActions.login.success({
          user: user.data,
          token: res.data.message
        })
      );
    } catch (e) {
      return dispatch(userActions.login.failure(e.response.data));
    }
  };
};
