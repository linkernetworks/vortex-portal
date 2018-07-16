import { createStandardAction } from 'typesafe-actions';
import { Network } from './models';

const queryNetworks = createStandardAction('QUERY_NETWORKS')<{
  networks: Array<Network>;
}>();

const deleteNetwork = createStandardAction('DELETE_NETWORK')<{
  id: string;
}>();

export default {
  queryNetworks,
  deleteNetwork
};
