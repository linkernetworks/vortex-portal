import axios, { AxiosPromise } from 'axios';
import * as Container from '@/models/Container';

export const getContainer = (
  pod: string,
  container: string
): AxiosPromise<Container.Container> => {
  return axios.get(`/v1/monitoring/pods/${pod}/${container}`);
};
