import { ActionType, StateType, getType } from 'typesafe-actions';
import * as Cluster from './actions';

export type ClusterStateType = StateType<typeof clusterReducer>;
export type ClusterActionType = ActionType<typeof Cluster>;

const initialState = {
  nodes: {},
  pods: {},
  container: {},
  containers: {},
  allNodes: [],
  allPods: [],
  allContainers: [],
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
    case getType(Cluster.fetchPods.request):
    case getType(Cluster.fetchContainers.request):
    case getType(Cluster.fetchContainer.request):
      return { ...state, isLoading: true };
    case getType(Cluster.fetchNodes.success):
      return {
        ...state,
        nodes: action.payload,
        allNodes: Object.keys(action.payload),
        isLoading: false
      };
    case getType(Cluster.fetchNodeNICs.success):
      const nics = { ...state.nics, ...action.payload };
      return { ...state, nics, isLoading: false };
    case getType(Cluster.fetchPods.success):
      return {
        ...state,
        pods: action.payload,
        allPods: Object.keys(action.payload),
        isLoading: false
      };
    case getType(Cluster.fetchContainers.success):
      return {
        ...state,
        containers: action.payload,
        allContainers: Object.keys(action.payload),
        isLoading: false
      };
    case getType(Cluster.fetchContainer.success):
      return {
        ...state,
        container: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
}
