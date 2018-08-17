import { volumeReducer, VolumeStateType, VolumeActionType } from './reducers';
import * as volumeActions from './actions';
import * as volumeOperations from './operations';
import * as volumeModels from './models';

export {
  volumeModels,
  volumeActions,
  volumeOperations,
  VolumeActionType,
  VolumeStateType
};
export default volumeReducer;
