import { RTAction } from '../index';
import { clusterActions } from './index';
import * as nodeAPI from '@/services/node';

export const fetchNodes = (): RTAction<Promise<void>> => {
  return async dispatch => {
    dispatch(clusterActions.fetchNodes.request);
    try {
      const res = await nodeAPI.getNodes();
      dispatch(clusterActions.fetchNodes.success(res.data));
    } catch (e) {
      dispatch(clusterActions.fetchNodes.failure(e));
    }
  };
};
