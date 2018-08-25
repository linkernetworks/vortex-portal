import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import * as User from '@/models/User';

export const fetchUsers = createAsyncAction(
  'FETCH_USER_REQUEST',
  'FETCH_USER_SUCCESS',
  'FETCH_USER_FAILURE'
)<void, Array<User.User>, Error>();

export const removeUser = createAsyncAction(
  'REMOVE_USER_REQUEST',
  'REMOVE_USER_SUCCESS',
  'REMOVE_USER_FAILURE'
)<void, { id: string }, Error>();

export const clearUserError = createStandardAction('CLEAR_USER_ERROR')<void>();
