import axios, { AxiosPromise } from 'axios';
import * as Deployment from '@/models/Deployment';
import * as Query from '@/models/Query';

export const getController = (
  controller: string
): AxiosPromise<Deployment.Controller> => {
  return axios.get(`/v1/monitoring/controllers/${controller}`);
};

export const getControllers = (): AxiosPromise<Deployment.Controllers> => {
  return axios.get('/v1/monitoring/controllers');
};

export const getDeploymentsFromMongo = (): AxiosPromise<
  Array<Deployment.Deployment>
> => {
  return axios.get('/v1/deployments');
};

export const createDeployment = (
  data: Deployment.Deployment
): AxiosPromise<Deployment.Deployment> => {
  return axios.post(`/v1/deployments/`, data);
};

export const deleteDeployment = (id: string): AxiosPromise<Query.Response> => {
  return axios.delete(`/v1/deployments/${id}`);
};
