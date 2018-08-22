import axios, { AxiosPromise } from 'axios';
import { User, UserResponse, LoginCredential } from '@/models/User';
import { Response } from '@/models/Query';

export const signup = (data: User): AxiosPromise<UserResponse> => {
  return axios.post('/v1/user/signup', data);
};

export const signin = (data: LoginCredential): AxiosPromise<Response> => {
  return axios.post('/v1/user/signin', data);
};
