import { RTAction } from '../index';
import { clusterActions, ClusterActionType } from './index';
import * as PodModel from '@/models/Pod';
import * as ServiceModel from '@/models/Service';
import * as nodeAPI from '@/services/node';
import * as podAPI from '@/services/pod';
import * as containerAPI from '@/services/container';
import * as serviceAPI from '@/services/service';

export const fetchNodes = (): RTAction<Promise<ClusterActionType>> => {
  return async dispatch => {
    dispatch(clusterActions.fetchNodes.request());
    try {
      const res = await nodeAPI.getNodes();
      return dispatch(clusterActions.fetchNodes.success(res.data));
    } catch (e) {
      return dispatch(clusterActions.fetchNodes.failure(e));
    }
  };
};

export const fetchNodeNICs = (
  node: string
): RTAction<Promise<ClusterActionType>> => {
  return async dispatch => {
    dispatch(clusterActions.fetchNodeNICs.request());
    try {
      const res = await nodeAPI.getNodeNICs(node);
      return dispatch(
        clusterActions.fetchNodeNICs.success({
          [node]: res.data.nics
        })
      );
    } catch (e) {
      return dispatch(clusterActions.fetchNodeNICs.failure(e));
    }
  };
};

// export const fetchNodesWithNICs = (): RTAction<Promise<void>> => {
//   return async (dispatch, getState) => {
//     await dispatch(fetchNodes());
//     const nodes = getState().cluster.allNodes;
//     nodes.map(node => {
//       return dispatch(fetchNodeNICs(node));
//     });
//   };
// };

export const fetchPods = (): RTAction<Promise<ClusterActionType>> => {
  return async dispatch => {
    dispatch(clusterActions.fetchPods.request);
    try {
      const res = await podAPI.getPods();
      return dispatch(clusterActions.fetchPods.success(res.data));
    } catch (e) {
      return dispatch(clusterActions.fetchPods.failure(e));
    }
  };
};

export const fetchPod = (pod: string): RTAction<Promise<ClusterActionType>> => {
  return async dispatch => {
    dispatch(clusterActions.fetchPod.request);
    try {
      const res = await podAPI.getPod(pod);
      return dispatch(clusterActions.fetchPod.success(res.data));
    } catch (e) {
      return dispatch(clusterActions.fetchPod.failure(e));
    }
  };
};

export const fetchContainers = (): RTAction<Promise<ClusterActionType>> => {
  return async dispatch => {
    dispatch(clusterActions.fetchContainers.request);
    try {
      const res = await containerAPI.getContainers();
      return dispatch(clusterActions.fetchContainers.success(res.data));
    } catch (e) {
      return dispatch(clusterActions.fetchContainers.failure(e));
    }
  };
};

export const fetchContainer = (
  container: string
): RTAction<Promise<ClusterActionType>> => {
  return async dispatch => {
    dispatch(clusterActions.fetchContainer.request);
    try {
      const res = await containerAPI.getContainer(container);
      return dispatch(clusterActions.fetchContainer.success(res.data));
    } catch (e) {
      return dispatch(clusterActions.fetchContainer.failure(e));
    }
  };
};

export const addPod = (
  data: PodModel.PodRequest
): RTAction<Promise<ClusterActionType>> => {
  return async dispatch => {
    dispatch(clusterActions.addPod.request);
    try {
      const res = await podAPI.createPod(data);
      return dispatch(clusterActions.addPod.success(res.data));
    } catch (e) {
      return dispatch(clusterActions.addPod.failure(e));
    }
  };
};

export const fetchServices = (): RTAction<Promise<ClusterActionType>> => {
  return async dispatch => {
    dispatch(clusterActions.fetchServices.request());
    try {
      const res = await serviceAPI.getServices();
      return dispatch(clusterActions.fetchServices.success(res.data));
    } catch (e) {
      return dispatch(clusterActions.fetchServices.failure(e));
    }
  };
};

export const addService = (
  data: ServiceModel.Service
): RTAction<Promise<ClusterActionType>> => {
  return async dispatch => {
    dispatch(clusterActions.addService.request);
    try {
      const res = await serviceAPI.createService(data);
      return dispatch(clusterActions.addService.success(res.data));
    } catch (e) {
      return dispatch(clusterActions.addService.failure(e));
    }
  };
};

export const removeService = (
  id: string
): RTAction<Promise<ClusterActionType>> => {
  return async dispatch => {
    dispatch(clusterActions.removeService.request());
    try {
      const res = await serviceAPI.deleteService(id);
      if (!res.data.error) {
        return dispatch(clusterActions.removeService.success({ id }));
      } else {
        throw new Error(res.data.message);
      }
    } catch (e) {
      return dispatch(clusterActions.removeService.failure(e));
    }
  };
};
