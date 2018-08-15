import axios, { AxiosPromise } from 'axios';
import * as Namespace from '@/models/Namespace';
import * as Query from '@/models/Query';

export const getNamespaces = (): AxiosPromise<Array<Namespace.Namespace>> => {
  return axios.get('/v1/namespaces');
};

export const createNamespace = (
  data: Namespace.Namespace
): AxiosPromise<Namespace.Namespace> => {
  return axios.post(`/v1/namespaces/`, data);
};

export const deleteNamespace = (id: string): AxiosPromise<Query.Response> => {
  return axios.delete(`/v1/namespaces/${id}`);
};
