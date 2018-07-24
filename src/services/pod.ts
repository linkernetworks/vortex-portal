import axios, { AxiosPromise } from 'axios';
import * as Pod from '@/models/Pod';

export const getPods = (): AxiosPromise<Array<Pod.Pod>> => {
  return axios.get('/v1/pods');
};
