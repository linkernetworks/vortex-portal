import axios, { AxiosPromise } from 'axios';
import * as Pod from '@/models/Pod';
import * as Query from '@/models/Query';

export const getPod = (pod: string): AxiosPromise<Pod.Pod> => {
  return axios.get(`/v1/monitoring/pods/${pod}`);
};

export const getPods = (): AxiosPromise<Pod.Pods> => {
  return axios.get('/v1/monitoring/pods');
};

export const getPodFromMongo = (id: string): AxiosPromise<Pod.PodFromMongo> => {
  return axios.get(`/v1/pod/${id}`);
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
