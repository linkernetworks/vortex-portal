import { combineReducers } from 'redux';
import { ActionType, StateType, getType } from 'typesafe-actions';
import * as Volume from './actions';
import { Volume as volumeModel } from './models';

export type VolumeStateType = StateType<typeof volumeReducer>;

export type VolumeActionType = ActionType<typeof Volume>;

function isLoading(state = false, action: VolumeActionType) {
  switch (action.type) {
    case getType(Volume.fetchVolumes.request):
    case getType(Volume.addVolume.request):
    case getType(Volume.removeVolume.request):
      return true;
    case getType(Volume.fetchVolumes.success):
    case getType(Volume.addVolume.success):
    case getType(Volume.removeVolume.success):
    case getType(Volume.fetchVolumes.failure):
    case getType(Volume.addVolume.failure):
    case getType(Volume.removeVolume.failure):
      return false;
    default:
      return state;
  }
}

function hasError(state = null, action: VolumeActionType) {
  switch (action.type) {
    case getType(Volume.fetchVolumes.failure):
    case getType(Volume.addVolume.failure):
    case getType(Volume.removeVolume.failure):
      return action.payload;
    case getType(Volume.clearVolumeError):
      return null;
    default:
      return state;
  }
}

function volumes(state: Array<volumeModel> = [], action: VolumeActionType) {
  switch (action.type) {
    case getType(Volume.fetchVolumes.success):
      return action.payload;
    case getType(Volume.addVolume.success):
      return [...state, action.payload];
    case getType(Volume.removeVolume.success):
      return state.filter(volume => volume.id !== action.payload.id);
    default:
      return state;
  }
}

export const volumeReducer = combineReducers({
  volumes,
  isLoading,
  error: hasError
});
