import axios, { AxiosPromise } from 'axios';
import * as Service from '@/models/Service';
import * as Query from '@/models/Query';

export const getServices = (): AxiosPromise<Array<Service.Service>> => {
  return axios.get('/v1/services');
};

export const createService = (
  data: Service.Service
): AxiosPromise<Service.Service> => {
  return axios.post(`/v1/services/`, data);
};

export const deleteService = (id: string): AxiosPromise<Query.Response> => {
  return axios.delete(`/v1/services/${id}`);
};
