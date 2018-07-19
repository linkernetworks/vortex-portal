import axios, { AxiosPromise } from 'axios';
import * as Node from '@/models/Node';

export const getNodes = (): AxiosPromise<Array<string>> => {
  return axios.get('/v1/monitoring/nodes');
};

export const getNodeNICs = (
  node: string
): AxiosPromise<{
  nics: Array<Node.NetworkInterfaceController>;
}> => {
  return axios.get(`/v1/monitoring/nodes/${node}/nics`);
};
