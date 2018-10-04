import axios, { AxiosPromise } from 'axios';
import * as Container from '@/models/Container';

export const getContainer = (
  pod: string,
  container: string,
  option?: string
): AxiosPromise<Container.Container> => {
  switch (option) {
    case 'month':
      return axios.get(`/v1/monitoring/pods/${pod}/${container}`, {
        params: {
          interval: 43200,
          resolution: 7200,
          rate: 60
        }
      });
      break;
    case 'week':
      return axios.get(`/v1/monitoring/pods/${pod}/${container}`, {
        params: {
          interval: 10080,
          resolution: 1200,
          rate: 20
        }
      });
      break;
    case 'day':
      return axios.get(`/v1/monitoring/pods/${pod}/${container}`, {
        params: {
          interval: 1440,
          resolution: 300,
          rate: 5
        }
      });
    default:
      return axios.get(`/v1/monitoring/pods/${pod}/${container}`);
  }
};

export const getContainerLogs = (
  namespace: string,
  pod: string,
  container: string
): AxiosPromise<Container.ContainerLogs> => {
  return axios.get(`/v1/containers/logs/${namespace}/${pod}/${container}`, {
    params: {
      logFilePosition: 'end',
      offsetFrom: 2000000000,
      offsetTo: 2000000100,
      previous: false,
      referenceLineNum: 0,
      referenceTimestamp: 'newest'
    }
  });
};

export const getContainerLogFile = (
  namespace: string,
  pod: string,
  container: string
): AxiosPromise<string> => {
  return axios.get(`/v1/containers/logs/file/${namespace}/${pod}/${container}`);
};
