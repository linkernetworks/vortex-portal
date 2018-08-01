import axios, { AxiosPromise } from 'axios';
import * as Pod from '@/models/Pod';

export const getPod = (pod: string): AxiosPromise<Pod.Pod> => {
  return axios.get(`/v1/monitoring/pods/${pod}`);
};

export const getPods = (): AxiosPromise<Pod.Pods> => {
  return axios.get('/v1/monitoring/pods');
};

export const createPod = (
  data: Pod.PodRequest
): AxiosPromise<Pod.PodRequest> => {
  return axios.post(`/v1/pods/`, data);
};
