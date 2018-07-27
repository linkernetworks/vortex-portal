import axios, { AxiosPromise } from 'axios';
import * as Network from '@/models/Network';
import * as Query from '@/models/Query';

export const getNetworks = (): AxiosPromise<Array<Network.Network>> => {
  return axios.get('/v1/networks');
};

export const createNetwork = (
  data: Network.NetworkFields
): AxiosPromise<Network.Network> => {
  return axios.post(`/v1/networks/`, data);
};

export const deleteNetwork = (id: string): AxiosPromise<Query.Response> => {
  return axios.delete(`/v1/networks/${id}`);
};
