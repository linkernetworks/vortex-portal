import axios, { AxiosPromise } from 'axios';
import * as Container from '@/models/Container';

export const getContainer = (
  pod: string,
  container: string,
  option?: string
): AxiosPromise<Container.Container> => {
  switch (option) {
    case 'month':
      return axios.get(
        `/v1/monitoring/pods/${pod}/${container}?interval=43200&resolution=7200&rate=60`
      );
    case 'week':
      return axios.get(
        `/v1/monitoring/pods/${pod}/${container}?interval=10080&resolution=1200&rate=20`
      );
    case 'day':
      return axios.get(
        `/v1/monitoring/pods/${pod}/${container}?interval=1440&resolution=300&rate=5`
      );
    default:
      return axios.get(`/v1/monitoring/pods/${pod}/${container}`);
  }
};
