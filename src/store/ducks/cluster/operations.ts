import { RTAction } from '../index';
import { clusterActions, ClusterActionType } from './index';
import * as nodeAPI from '@/services/node';
import { resolve } from 'path';

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

export const fetchNodeNICs = (
  node: string
): RTAction<Promise<ClusterActionType>> => {
  return async dispatch => {
    dispatch(clusterActions.fetchNodeNICs.request);
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

export const fetchNodesWithNICs = (): RTAction<Promise<void>> => {
  return async (dispatch, getState) => {
    await dispatch(fetchNodes());
    const nodes = getState().cluster.nodes;
    nodes.map(node => {
      return dispatch(fetchNodeNICs(node));
    });
  };
};
