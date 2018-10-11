import axios, { AxiosPromise } from 'axios';
import * as Configmap from '@/models/Configmap';

export const getConfigmaps = (): AxiosPromise<Array<Configmap.Configmap>> => {
  return axios.get('/v1/configmaps');
};
