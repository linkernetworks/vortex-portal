import { combineReducers } from 'redux';
import { ActionType, StateType, getType } from 'typesafe-actions';
import * as User from './actions';
import { User as userModel, Auth } from './models';

export type UserStateType = StateType<typeof userReducer>;

export type UserActionType = ActionType<typeof User>;

function isLoading(state = false, action: UserActionType) {
  switch (action.type) {
    case getType(User.fetchUsers.request):
    case getType(User.removeUser.request):
    case getType(User.login.request):
      return true;
    case getType(User.fetchUsers.success):
    case getType(User.removeUser.success):
    case getType(User.login.success):
    case getType(User.fetchUsers.failure):
    case getType(User.removeUser.failure):
    case getType(User.login.failure):
      return false;
    default:
      return state;
  }
}

function hasError(state = null, action: UserActionType) {
  switch (action.type) {
    case getType(User.fetchUsers.failure):
    case getType(User.removeUser.failure):
    case getType(User.login.failure):
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

function auth(
  state: Auth = {
    isAuthenticated: false,
    token: '',
    user: null
  },
  action: UserActionType
) {
  switch (action.type) {
    case getType(User.login.success):
      return {
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user
      };
    case getType(User.login.failure):
    case getType(User.logout):
      return {
        isAuthenticated: false,
        token: '',
        user: null
      };
    default:
      return state;
  }
}

export const userReducer = combineReducers({
  auth,
  users,
  isLoading,
  error: hasError
});
