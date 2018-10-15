import { RTAction } from '../index';
import { storageModels, storageActions, StorageActionType } from './index';
import * as storageAPI from '@/services/storage';

export const fetchStorage = (): RTAction<Promise<StorageActionType>> => {
  return async dispatch => {
    dispatch(storageActions.fetchStorages.request());
    try {
      const res = await storageAPI.getStorages();
      return dispatch(storageActions.fetchStorages.success(res.data));
    } catch (e) {
      return dispatch(storageActions.fetchStorages.failure(e));
    }
  };
};

export const addStorage = (
  data: storageModels.StorageFields
): RTAction<Promise<StorageActionType>> => {
  return async dispatch => {
    dispatch(storageActions.addStorage.request());
    try {
      const res = await storageAPI.createStorage(data);
      return dispatch(storageActions.addStorage.success(res.data));
    } catch (e) {
      return dispatch(storageActions.addStorage.failure(e.response.data));
    }
  };
};

export const removeStorage = (
  id: string
): RTAction<Promise<StorageActionType>> => {
  return async dispatch => {
    dispatch(storageActions.removeStorage.request());
    try {
      const res = await storageAPI.deleteStorage(id);
      if (!res.data.error) {
        return dispatch(storageActions.removeStorage.success({ id }));
      } else {
        throw new Error(res.data.message);
      }
    } catch (e) {
      return dispatch(storageActions.removeStorage.failure(e.response.data));
    }
  };
};
