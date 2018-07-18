import axios, { AxiosPromise } from 'axios';

export const getNodes = (): AxiosPromise<any> => {
  return axios.get('/v1/monitoring/nodes');
};
