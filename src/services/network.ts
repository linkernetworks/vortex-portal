import axios, { AxiosPromise } from 'axios';
import * as Network from '@/models/Network';

export const getNetworks = (): AxiosPromise<Array<Network.Network>> => {
  return axios.get('/v1/networks');
};
