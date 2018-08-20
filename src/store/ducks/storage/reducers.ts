import { combineReducers } from 'redux';
import { ActionType, StateType, getType } from 'typesafe-actions';
import * as Storage from './actions';
import { Storage as storageModel } from './models';

export type StorageStateType = StateType<typeof storageReducer>;
export type StorageActionType = ActionType<typeof Storage>;

function isLoading(state = false, action: StorageActionType) {
  switch (action.type) {
    case getType(Storage.fetchStorages.request):
    case getType(Storage.addStorage.request):
    case getType(Storage.removeStorage.request):
      return true;
    case getType(Storage.fetchStorages.success):
    case getType(Storage.addStorage.success):
    case getType(Storage.removeStorage.success):
    case getType(Storage.fetchStorages.failure):
    case getType(Storage.addStorage.failure):
    case getType(Storage.removeStorage.failure):
      return false;
    default:
      return state;
  }
}

function hasError(state = null, action: StorageActionType) {
  switch (action.type) {
    case getType(Storage.fetchStorages.failure):
    case getType(Storage.addStorage.failure):
    case getType(Storage.removeStorage.failure):
      return action.payload;
    case getType(Storage.clearStorageError):
      return null;
    default:
      return state;
  }
}

function storages(state: Array<storageModel> = [], action: StorageActionType) {
  switch (action.type) {
    case getType(Storage.fetchStorages.success):
      return action.payload;
    case getType(Storage.addStorage.success):
      return [...state, action.payload];
    case getType(Storage.removeStorage.success):
      return state.filter(storage => storage.id !== action.payload.id);
    default:
      return state;
  }
}

export const storageReducer = combineReducers({
  storages,
  isLoading,
  error: hasError
});
