import { createStandardAction, createAsyncAction } from 'typesafe-actions';
import * as Network from './models';

export const fetchNetworks = createAsyncAction(
  'FETCH_NETWORKS_REQUEST',
  'FETCH_NETWORKS_SUCCESS',
  'FETCH_NETWORKS_FAILURE'
)<void, Array<Network.Network>, Error>();

export const addNetwork = createAsyncAction(
  'ADD_NETWORK_REQUEST',
  'ADD_NETWORK_SUCCESS',
  'ADD_NETWORK_FAILURE'
)<void, Network.Network, Error>();

export const removeNetwork = createAsyncAction(
  'REMOVE_NETWORK_REQUEST',
  'REMOVE_NETWORK_SUCCESS',
  'REMOVE_NETWORK_FAILURE'
)<void, { id: string }, Error>();

export const deleteNetwork = createStandardAction('DELETE_NETWORK')<{
  id: string;
}>();
