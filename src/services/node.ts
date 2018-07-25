import axios, { AxiosPromise } from 'axios';
import * as Node from '@/models/Node';

export const getNodes = (): AxiosPromise<Node.Nodes> => {
  return axios.get('/v1/monitoring/nodes');
};

export const getNodeNICs = (
  node: string
): AxiosPromise<{
  nics: Array<Node.NICBrief>;
}> => {
  return axios.get(`/v1/monitoring/nodes/${node}/nics`);
};
