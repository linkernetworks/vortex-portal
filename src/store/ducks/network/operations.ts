import { RTAction } from '../index';
import { networkActions, NetworkActionType } from './index';
import * as networkAPI from '@/services/network';

export const fetchNeworks = (): RTAction<Promise<NetworkActionType>> => {
  return async dispatch => {
    dispatch(networkActions.fetchNetworks.request);
    try {
      const res = await networkAPI.getNetworks();
      return dispatch(networkActions.fetchNetworks.success(res.data));
    } catch (e) {
      return dispatch(networkActions.fetchNetworks.failure(e));
    }
  };
};
