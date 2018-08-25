import { userReducer, UserStateType, UserActionType } from './reducers';
import * as userActions from './actions';
import * as userOperations from './operations';
import * as userSelectors from './selectors';
import * as userModels from './models';

export {
  userModels,
  userActions,
  userSelectors,
  userOperations,
  UserActionType,
  UserStateType
};
export default userReducer;
