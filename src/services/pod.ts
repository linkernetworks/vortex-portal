import axios, { AxiosPromise } from 'axios';
import * as Pod from '@/models/Pod';
import * as Query from '@/models/Query';

export const getPods = (option?: string): AxiosPromise<Pod.Pods> => {
  switch (option) {
    case 'month':
      return axios.get(
        '/v1/monitoring/pods?interval=43200&resolution=7200&rate=60'
      );
    case 'week':
      return axios.get(
        '/v1/monitoring/pods?interval=10080&resolution=1200&rate=20'
      );
    case 'day':
      return axios.get(
        '/v1/monitoring/pods?interval=1440&resolution=300&rate=5'
      );
    default:
      return axios.get('/v1/monitoring/pods');
  }
};

export const getPod = (pod: string, option?: string): AxiosPromise<Pod.Pod> => {
  switch (option) {
    case 'month':
      return axios.get(
        `/v1/monitoring/pods/${pod}?interval=43200&resolution=7200&rate=60`
      );
    case 'week':
      return axios.get(
        `/v1/monitoring/pods/${pod}?interval=10080&resolution=1200&rate=20`
      );
    case 'day':
      return axios.get(
        `/v1/monitoring/pods/${pod}?interval=1440&resolution=300&rate=5`
      );
    default:
      return axios.get(`/v1/monitoring/pods/${pod}`);
  }
};

export const getPodsFromMongo = (): AxiosPromise<Array<Pod.PodFromMongo>> => {
  return axios.get('/v1/pods');
};

export const createPod = (
  data: Pod.PodRequest
): AxiosPromise<Pod.PodRequest> => {
  return axios.post(`/v1/pods/`, data);
};

export const deletePod = (id: string): AxiosPromise<Query.Response> => {
  return axios.delete(`/v1/pods/${id}`);
};

export const deletePodByName = (
  namespace: string,
  id: string
): AxiosPromise<Query.Response> => {
  return axios.delete(`/v1/pods/${namespace}/${id}`);
};
