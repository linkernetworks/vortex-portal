import axios, { AxiosPromise } from 'axios';
import { Response } from '@/models/Query';
import { Storage, StorageFields, Volume, VolumeFields } from '@/models/Storage';

export const getStorages = (): AxiosPromise<Array<Storage>> => {
  return axios.get('/v1/storage');
};

export const createStorage = (data: StorageFields) => {
  return axios.post('/v1/storage', data);
};

export const deleteStorage = (id: string): AxiosPromise<Response> => {
  return axios.delete(`/v1/storage/${id}`);
};

export const getVolumes = (): AxiosPromise<Array<Volume>> => {
  return axios.get('/v1/volume');
};

export const createVolume = (data: VolumeFields) => {
  return axios.post('/v1/volume', data);
};

export const deleteVolume = (id: string): AxiosPromise<Response> => {
  return axios.delete(`/v1/volume/${id}`);
};
