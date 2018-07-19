import { ActionType, StateType, getType } from 'typesafe-actions';
import * as Cluster from './actions';

export type ClusterStateType = StateType<typeof clusterReducer>;
export type ClusterActionType = ActionType<typeof Cluster>;

const initialState = {
  nodes: [],
  nics: {},
  isLoading: false
};

export function clusterReducer(
  state = initialState,
  action: ClusterActionType
) {
  if (state === undefined) {
    return initialState;
  }

  switch (action.type) {
    case getType(Cluster.fetchNodes.request):
    case getType(Cluster.fetchNodeNICs.request):
      return { ...state, isLoading: true };
    case getType(Cluster.fetchNodes.success):
      return { ...state, nodes: action.payload, isLoading: false };
    case getType(Cluster.fetchNodeNICs.success):
      const nics = { ...state.nics, ...action.payload };
      return { ...state, nics, isLoading: false };
    default:
      return state;
  }
}
