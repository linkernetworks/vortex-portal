import axios, { AxiosPromise } from 'axios';
import * as Node from '@/models/Node';

export const getNodes = (option?: string): AxiosPromise<Node.Nodes> => {
  switch (option) {
    case 'month':
      return axios.get(
        '/v1/monitoring/nodes?interval=43200&resolution=7200&rate=60'
      );
      break;
    case 'week':
      return axios.get(
        '/v1/monitoring/nodes?interval=10080&resolution=1200&rate=20'
      );
    case 'day':
      return axios.get(
        '/v1/monitoring/nodes?interval=1440&resolution=300&rate=5'
      );
    default:
      return axios.get('/v1/monitoring/nodes');
  }
};

export const getNode = (
  node: string,
  option?: string
): AxiosPromise<Node.Node> => {
  switch (option) {
    case 'month':
      return axios.get(
        `/v1/monitoring/nodes/${node}?interval=43200&resolution=7200&rate=60`
      );
      break;
    case 'week':
      return axios.get(
        `/v1/monitoring/nodes/${node}?interval=10080&resolution=1200&rate=20`
      );
    case 'day':
      return axios.get(
        `/v1/monitoring/nodes/${node}?interval=1440&resolution=300&rate=5`
      );
    default:
      return axios.get(`/v1/monitoring/nodes/${node}`);
  }
};

export const getNodeNICs = (
  node: string
): AxiosPromise<{
  nics: Array<Node.NICBrief>;
}> => {
  return axios.get(`/v1/monitoring/nodes/${node}/nics`);
};
