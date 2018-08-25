import axios, { AxiosPromise } from 'axios';
import { User, UserBrief, LoginCredential } from '@/models/User';
import { Response } from '@/models/Query';

export const signup = (data: UserBrief): AxiosPromise<User> => {
  return axios.post('/v1/users/signup', data);
};

export const signin = (data: LoginCredential): AxiosPromise<Response> => {
  return axios.post('/v1/users/signin', data);
};

export const getUsers = (): AxiosPromise<Array<User>> => {
  return axios.get('/v1/users');
};

export const deleteUser = (id: string): AxiosPromise<Response> => {
  return axios.delete(`/v1/users/${id}`);
};
