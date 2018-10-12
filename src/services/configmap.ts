import axios, { AxiosPromise } from 'axios';
import * as Configmap from '@/models/Configmap';
import * as Query from '@/models/Query';

export const getConfigmaps = (): AxiosPromise<Array<Configmap.Configmap>> => {
  return axios.get('/v1/configmaps');
};

export const createConfigmap = (
  data: Configmap.Configmap
): AxiosPromise<Configmap.Configmap> => {
  return axios.post(`/v1/configmaps/`, data);
};

export const deleteConfigmap = (id: string): AxiosPromise<Query.Response> => {
  return axios.delete(`/v1/configmaps/${id}`);
};
