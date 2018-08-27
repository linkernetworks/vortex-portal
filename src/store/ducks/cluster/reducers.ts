import { ActionType, getType } from 'typesafe-actions';
import * as Cluster from './actions';
import * as Node from '@/models/Node';
import * as Pod from '@/models/Pod';
import * as Service from '@/models/Service';
import * as Namespace from '@/models/Namespace';
import * as Deployment from '@/models/Deployment';

export interface ClusterStateType {
  nodes: Node.Nodes;
  pods: Pod.Pods;
  podsFromMongo: Array<Pod.PodFromMongo>;
  containers: {};
  deployments: Deployment.Controllers;
  services: Array<Service.Service>;
  namespaces: Array<Namespace.Namespace>;
  allNodes: Array<string>;
  allPods: Array<string>;
  allContainers: Array<string>;
  allDeployments: Array<string>;
  nics: {};
  isLoading: boolean;
}

export type ClusterActionType = ActionType<typeof Cluster>;

const initialState: ClusterStateType = {
  nodes: {},
  pods: {},
  podsFromMongo: [],
  containers: {},
  deployments: {},
  services: [],
  namespaces: [],
  allNodes: [],
  allPods: [],
  allContainers: [],
  allDeployments: [],
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
    case getType(Cluster.fetchPodsFromMongo.request):
    case getType(Cluster.removePod.request):
    case getType(Cluster.fetchContainers.request):
    case getType(Cluster.fetchContainer.request):
    case getType(Cluster.fetchServices.request):
    case getType(Cluster.fetchNamespaces.request):
    case getType(Cluster.addPod.request):
    case getType(Cluster.addService.request):
    case getType(Cluster.addNamespace.request):
    case getType(Cluster.removeService.request):
    case getType(Cluster.removeNamespace.request):
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
          [action.payload.podName]: action.payload
        },
        isLoading: false
      };
    case getType(Cluster.fetchPodsFromMongo.success):
      return {
        ...state,
        podsFromMongo: action.payload,
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
          [action.payload.detail.containerName]: action.payload
        },
        isLoading: false
      };
    case getType(Cluster.addPod.success):
      return {
        ...state,
        isLoading: false
      };
    case getType(Cluster.removePod.success):
      return {
        ...state,
        isLoading: false,
        podsFromMongo: state.podsFromMongo.filter(
          record => record.id !== action.payload.id
        )
      };
    case getType(Cluster.fetchServices.success):
      return {
        ...state,
        services: action.payload,
        isLoading: false
      };
    case getType(Cluster.addService.success):
      return {
        ...state,
        isLoading: false,
        services: [...state.services, action.payload]
      };
    case getType(Cluster.removeService.success):
      return {
        ...state,
        isLoading: false,
        services: state.services.filter(
          record => record.id !== action.payload.id
        )
      };
    case getType(Cluster.fetchNamespaces.success):
      return {
        ...state,
        namespaces: action.payload,
        isLoading: false
      };
    case getType(Cluster.addNamespace.success):
      return {
        ...state,
        isLoading: false,
        namespaces: [...state.namespaces, action.payload]
      };
    case getType(Cluster.removeNamespace.success):
      return {
        ...state,
        isLoading: false,
        namespaces: state.namespaces.filter(
          record => record.id !== action.payload.id
        )
      };
    case getType(Cluster.fetchDeployments.success):
      return {
        ...state,
        deployments: action.payload,
        allDeployments: Object.keys(action.payload),
        isLoading: false
      };
    case getType(Cluster.addDeployment.success):
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}
