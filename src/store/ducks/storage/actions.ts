import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import * as Storage from '@/models/Storage';

export const fetchStorages = createAsyncAction(
  'FETCH_STORAGE_REQUEST',
  'FETCH_STORAGE_SUCCESS',
  'FETCH_STORAGE_FAILURE'
)<void, Array<Storage.Storage>, Error>();

export const fetchVolumes = createAsyncAction(
  'FETCH_VOLUME_REQUEST',
  'FETCH_VOLUME_SUCCESS',
  'FETCH_VOLUME_FAILURE'
)<void, Array<Storage.Volume>, Error>();

export const addStorage = createAsyncAction(
  'ADD_STORAGE_REQUEST',
  'ADD_STORAGE_SUCCESS',
  'ADD_STORAGE_FAILURE'
)<void, Storage.Storage, Error>();

export const addVolume = createAsyncAction(
  'ADD_VOLUME_REQUEST',
  'ADD_VOLUME_SUCCESS',
  'ADD_VOLUME_FAILURE'
)<void, Storage.Volume, Error>();

export const removeStorage = createAsyncAction(
  'REMOVE_STORAGE_REQUEST',
  'REMOVE_STORAGE_SUCCESS',
  'REMOVE_STORAGE_FAILURE'
)<void, { id: string }, Error>();

export const removeVolume = createAsyncAction(
  'REMOVE_VOLUME_REQUEST',
  'REMOVE_VOLUME_SUCCESS',
  'REMOVE_VOLUME_FAILURE'
)<void, { id: string }, Error>();

export const clearStorageError = createStandardAction('CLEAR_STORAGE_ERROR')<
  void
>();
