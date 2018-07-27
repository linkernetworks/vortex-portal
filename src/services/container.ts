import axios, { AxiosPromise } from 'axios';
import * as Container from '@/models/Container';

export const getContainer = (
  container: string
): AxiosPromise<Container.Container> => {
  return axios.get(`/v1/monitoring/containers/${container}`);
};

export const getContainers = (): AxiosPromise<Container.Containers> => {
  return axios.get('/v1/monitoring/containers');
};
