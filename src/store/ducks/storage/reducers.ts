import { ActionType, getType } from 'typesafe-actions';
import * as Storage from './actions';

export type StorageStateType = Readonly<{
  storages: Array<any>;
  volumes: Array<any>;
}>;

export type StorageActionType = ActionType<typeof Storage>;

const inititalState: StorageStateType = {
  storages: [],
  volumes: []
};

export function storageReducer(
  state = inititalState,
  action: StorageActionType
) {
  if (state === undefined) {
    return inititalState;
  }

  switch (action.type) {
    case getType(Storage.fetchStorages.success):
      return { ...state, storages: action.payload };
    case getType(Storage.fetchVolumes.success):
      return { ...state, volumes: action.payload };
    default:
      return state;
  }
}
