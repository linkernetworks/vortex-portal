import { ActionType, getType } from 'typesafe-actions';
import { last } from 'lodash';
import * as Cluster from './actions';
import * as Node from '@/models/Node';
import * as Pod from '@/models/Pod';
import * as Service from '@/models/Service';
import * as Namespace from '@/models/Namespace';
import * as Deployment from '@/models/Deployment';

export interface ClusterStateType {
  nodes: Node.Nodes;
  nodesNics: Node.NodesNics;
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
  isLoading: boolean;
}

export type ClusterActionType = ActionType<typeof Cluster>;

const initialState: ClusterStateType = {
  nodes: {},
  nodesNics: {},
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
    case getType(Cluster.fetchPods.request):
    case getType(Cluster.fetchPod.request):
    case getType(Cluster.fetchPodsFromMongo.request):
    case getType(Cluster.removePod.request):
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
      const nodes = action.payload;
      const allNodes = Object.keys(action.payload);
      const nodesNics = state.nodesNics;

      allNodes.map(key => {
        const nics = nodes[key].nics;
        Object.keys(nics).map(name => {
          // Remove virtual interface
          if (nics[name].type !== 'physical') {
            delete nics[name];
          } else if (nics[name].dpdk === true) {
            delete nics[name];
          } else {
            // Add nics data or creating nics data for chart to draw
            if (
              nodesNics.hasOwnProperty(key) &&
              nodesNics[key].hasOwnProperty(name)
            ) {
              const newNetworkTraffic = nics[name].nicNetworkTraffic;
              const originNetworkTraffic =
                nodesNics[key][name].nicNetworkTraffic;

              const receiveBytesTotal = last(
                originNetworkTraffic.receiveBytesTotal
              );
              newNetworkTraffic.receiveBytesTotal.map(data => {
                if (
                  receiveBytesTotal &&
                  data.timestamp > receiveBytesTotal.timestamp
                ) {
                  originNetworkTraffic.receiveBytesTotal.push(data);
                }
              });

              const transmitBytesTotal = last(
                originNetworkTraffic.transmitBytesTotal
              );
              newNetworkTraffic.transmitBytesTotal.map(data => {
                if (
                  transmitBytesTotal &&
                  data.timestamp > transmitBytesTotal.timestamp
                ) {
                  originNetworkTraffic.transmitBytesTotal.push(data);
                }
              });

              const receivePacketsTotal = last(
                originNetworkTraffic.receivePacketsTotal
              );
              newNetworkTraffic.receivePacketsTotal.map(data => {
                if (
                  receivePacketsTotal &&
                  data.timestamp > receivePacketsTotal.timestamp
                ) {
                  originNetworkTraffic.receivePacketsTotal.push(data);
                }
              });

              const transmitPacketsTotal = last(
                originNetworkTraffic.transmitPacketsTotal
              );
              newNetworkTraffic.transmitPacketsTotal.map(data => {
                if (
                  transmitPacketsTotal &&
                  data.timestamp > transmitPacketsTotal.timestamp
                ) {
                  originNetworkTraffic.transmitPacketsTotal.push(data);
                }
              });
            } else {
              if (nodesNics.hasOwnProperty(key)) {
                nodesNics[key][name] = nics[name];
              } else {
                nodesNics[key] = {};
                nodesNics[key][name] = nics[name];
              }
            }
          }
        });
      });
      return {
        ...state,
        nodes,
        allNodes,
        nodesNics,
        isLoading: false
      };
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
