import { ActionType, StateType, getType } from 'typesafe-actions';
import * as Cluster from './actions';
import * as Node from '@/models/Node';
import * as Pod from '@/models/Pod';
import * as Service from '@/models/Service';

export type ClusterStateType = StateType<typeof clusterReducer>;
export type ClusterActionType = ActionType<typeof Cluster>;

const initialState: {
  nodes: Node.Nodes;
  pods: Pod.Pods;
  containers: {};
  services: Array<Service.Service>;
  allNodes: Array<string>;
  allPods: Array<string>;
  allContainers: Array<string>;
  nics: {};
  isLoading: boolean;
} = {
  nodes: {},
  pods: {},
  containers: {},
  services: [],
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
    case getType(Cluster.fetchPod.request):
    case getType(Cluster.fetchContainers.request):
    case getType(Cluster.fetchContainer.request):
    case getType(Cluster.fetchServices.request):
    case getType(Cluster.addPod.request):
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
    case getType(Cluster.fetchPod.success):
      return {
        ...state,
        pods: {
          ...state.pods,
          ...action.payload
        },
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
        containers: {
          ...state.containers,
          ...action.payload
        },
        isLoading: false
      };
    case getType(Cluster.addPod.success):
      return {
        ...state,
        isLoading: false
      };
    case getType(Cluster.fetchServices.success):
      return {
        ...state,
        services: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
}
