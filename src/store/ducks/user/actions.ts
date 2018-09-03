import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import * as User from '@/models/User';

export const fetchUsers = createAsyncAction(
  'FETCH_USER_REQUEST',
  'FETCH_USER_SUCCESS',
  'FETCH_USER_FAILURE'
)<void, Array<User.User>, Error>();

export const addUser = createAsyncAction(
  'ADD_USER_REQUEST',
  'ADD_USER_SUCCESS',
  'ADD_USER_FAILURE'
)<void, User.User, Error>();

export const removeUser = createAsyncAction(
  'REMOVE_USER_REQUEST',
  'REMOVE_USER_SUCCESS',
  'REMOVE_USER_FAILURE'
)<void, { id: string }, Error>();

export const login = createAsyncAction(
  'LOGIN_REQUEST',
  'LOGIN_SUCCESS',
  'LOGIN_FAILURE'
)<
  void,
  {
    user: User.User;
    token: string;
  },
  Error
>();

export const logout = createStandardAction('LOGOUT')<void>();

export const clearUserError = createStandardAction('CLEAR_USER_ERROR')<void>();
