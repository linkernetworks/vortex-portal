import axios, { AxiosPromise } from 'axios';
import * as Service from '@/models/Service';

export const getServices = (): AxiosPromise<Array<Service.Service>> => {
  return axios.get('/v1/services');
};
