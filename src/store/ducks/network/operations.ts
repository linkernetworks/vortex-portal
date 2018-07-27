import { RTAction } from '../index';
import { networkActions, NetworkActionType, networkModels } from './index';
import * as networkAPI from '@/services/network';

export const fetchNetworks = (): RTAction<Promise<NetworkActionType>> => {
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

export const addNetwork = (
  data: networkModels.NetworkFields
): RTAction<Promise<NetworkActionType>> => {
  return async dispatch => {
    dispatch(networkActions.addNetwork.request);
    try {
      const res = await networkAPI.createNetwork(data);
      return dispatch(networkActions.addNetwork.success(res.data));
    } catch (e) {
      return dispatch(networkActions.addNetwork.failure(e));
    }
  };
};

export const removeNetwork = (
  id: string
): RTAction<Promise<NetworkActionType>> => {
  return async dispatch => {
    dispatch(networkActions.removeNetwork.request);
    try {
      const res = await networkAPI.deleteNetwork(id);
      return dispatch(networkActions.removeNetwork.success({ id }));
    } catch (e) {
      return dispatch(networkActions.removeNetwork.failure(e));
    }
  };
};
