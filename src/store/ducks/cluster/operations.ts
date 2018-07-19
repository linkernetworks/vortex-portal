import { RTAction } from '../index';
import { clusterActions, ClusterActionType } from './index';
import * as nodeAPI from '@/services/node';

export const fetchNodes = (): RTAction<Promise<ClusterActionType>> => {
  return async dispatch => {
    dispatch(clusterActions.fetchNodes.request);
    try {
      const res = await nodeAPI.getNodes();
      return dispatch(clusterActions.fetchNodes.success(res.data));
    } catch (e) {
      return dispatch(clusterActions.fetchNodes.failure(e));
    }
  };
};

export const fetchNodesNIC = (node: string): RTAction<Promise<any>> => {
  return async dispatch => {
    dispatch(clusterActions.fetchNodeNICs.request);
    try {
      const res = await nodeAPI.getNodeNICs(node);
      return dispatch(
        clusterActions.fetchNodeNICs.success({
          node,
          ...res.data
        })
      );
    } catch (e) {
      return dispatch(clusterActions.fetchNodeNICs.failure(e));
    }
  };
};
