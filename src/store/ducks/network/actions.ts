import { createStandardAction, createAsyncAction } from 'typesafe-actions';
import * as Network from './models';

export const fetchNetworks = createAsyncAction(
  'FETCH_NETWORKS_REQUEST',
  'FETCH_NETWORKS_SUCCESS',
  'FETCH_NETWORKS_FAILURE'
)<void, Array<Network.Network>, Error>();

export const deleteNetwork = createStandardAction('DELETE_NETWORK')<{
  id: string;
}>();
