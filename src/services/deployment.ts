import axios, { AxiosPromise } from 'axios';
import * as Deployment from '@/models/Deployment';

export const getController = (
  controller: string
): AxiosPromise<Deployment.Controller> => {
  return axios.get(`/v1/monitoring/controllers/${controller}`);
};

export const getControllers = (): AxiosPromise<Deployment.Controllers> => {
  return axios.get('/v1/monitoring/controllers');
};

export const createDeployment = (
  data: Deployment.Deployment
): AxiosPromise<Deployment.Deployment> => {
  return axios.post(`/v1/deployments/`, data);
};
