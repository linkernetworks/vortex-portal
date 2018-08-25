import { combineReducers } from 'redux';
import { ActionType, StateType, getType } from 'typesafe-actions';
import * as User from './actions';
import { User as userModel } from './models';

export type UserStateType = StateType<typeof userReducer>;

export type UserActionType = ActionType<typeof User>;

function isLoading(state = false, action: UserActionType) {
  switch (action.type) {
    case getType(User.fetchUsers.request):
    case getType(User.removeUser.request):
      return true;
    case getType(User.fetchUsers.success):
    case getType(User.removeUser.success):
    case getType(User.fetchUsers.failure):
    case getType(User.removeUser.failure):
      return false;
    default:
      return state;
  }
}

function hasError(state = null, action: UserActionType) {
  switch (action.type) {
    case getType(User.fetchUsers.failure):
    case getType(User.removeUser.failure):
      return action.payload;
    case getType(User.clearUserError):
      return null;
    default:
      return state;
  }
}

function users(state: Array<userModel> = [], action: UserActionType) {
  switch (action.type) {
    case getType(User.fetchUsers.success):
      return action.payload;
    case getType(User.removeUser.success):
      return state.filter(user => user.id !== action.payload.id);
    default:
      return state;
  }
}

export const userReducer = combineReducers({
  users,
  isLoading,
  error: hasError
});
