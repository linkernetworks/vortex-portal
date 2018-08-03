import axios, { AxiosPromise } from 'axios';
import * as Query from '@/models/Query';

export const getVersion = (): AxiosPromise<Query.Response> => {
  return axios.get('/v1/version');
};
