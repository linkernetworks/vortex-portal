import axios, { AxiosPromise } from 'axios';
import * as Pod from '@/models/Pod';

export const getPods = (): AxiosPromise<Pod.Pods> => {
  return axios.get('/v1/monitoring/pods');
};
