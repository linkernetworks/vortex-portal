import { RTAction } from '../index';
import * as nodeAPI from '@/services/node';

export const fetchNodesRequest = (): RTAction<Promise<any>> => {
  return dispatch => {
    return nodeAPI.getNodes().then(res => {
      dispatch({
        type: 'FETCH_NODES_SUCCESS',
        payload: { nodes: res.data }
      });
    });
  };
};
