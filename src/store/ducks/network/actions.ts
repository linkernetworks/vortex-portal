import { createStandardAction } from 'typesafe-actions';
import { Network } from './models';

export const queryNetworks = createStandardAction('QUERY_NETWORKS')<{
  networks: Array<Network>;
}>();

export const deleteNetwork = createStandardAction('DELETE_NETWORK')<{
  id: string;
}>();
