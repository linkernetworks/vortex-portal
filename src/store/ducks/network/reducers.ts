import { ActionType, StateType, getType } from 'typesafe-actions';
import * as Network from './actions';
import { Network as networkModel } from './models';

export type NetworkStateType = StateType<typeof networkReducer>;
export type NetworkActionType = ActionType<typeof Network>;

const initialState: {
  networks: Array<networkModel>;
  isLoading: boolean;
  error?: Error;
} = {
  networks: [],
  isLoading: false
};

export function networkReducer(
  state = initialState,
  action: NetworkActionType
) {
  if (state === undefined) {
    return initialState;
  }

  switch (action.type) {
    case getType(Network.fetchNetworks.request):
    case getType(Network.addNetwork.request):
    case getType(Network.removeNetwork.request):
      return {
        ...state,
        isLoading: true
      };
    case getType(Network.fetchNetworks.success):
      return {
        ...state,
        isLoading: false,
        networks: action.payload
      };
    case getType(Network.addNetwork.success):
      return {
        ...state,
        isLoading: false,
        networks: [...state.networks, action.payload]
      };
    case getType(Network.removeNetwork.success):
      return {
        ...state,
        isLoading: false,
        networks: state.networks.filter(
          record => record.id !== action.payload.id
        )
      };
    case getType(Network.removeNetwork.failure):
      return {
        ...state,
        error: action.payload
      };
    case getType(Network.clearNetworkError):
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
}
