import { RTAction } from '../index';
import { volumeModels, volumeActions, VolumeActionType } from './index';
import * as storageAPI from '@/services/storage';

export const fetchVolumes = (): RTAction<Promise<VolumeActionType>> => {
  return async dispatch => {
    dispatch(volumeActions.fetchVolumes.request());
    try {
      const res = await storageAPI.getVolumes();
      return dispatch(volumeActions.fetchVolumes.success(res.data));
    } catch (e) {
      return dispatch(volumeActions.fetchVolumes.failure(e));
    }
  };
};

export const addVolume = (
  data: volumeModels.VolumeFields
): RTAction<Promise<VolumeActionType>> => {
  return async dispatch => {
    dispatch(volumeActions.addVolume.request());
    try {
      const res = await storageAPI.createVolume(data);
      return dispatch(volumeActions.addVolume.success(res.data));
    } catch (e) {
      return dispatch(volumeActions.addVolume.failure(e.response.data));
    }
  };
};

export const removeVolume = (
  id: string
): RTAction<Promise<VolumeActionType>> => {
  return async dispatch => {
    dispatch(volumeActions.removeVolume.request());
    try {
      const res = await storageAPI.deleteVolume(id);
      if (!res.data.error) {
        return dispatch(volumeActions.removeVolume.success({ id }));
      } else {
        throw new Error(res.data.message);
      }
    } catch (e) {
      return dispatch(volumeActions.removeVolume.failure(e.response.data));
    }
  };
};
