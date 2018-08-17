import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import * as Storage from '@/models/Storage';

export const fetchVolumes = createAsyncAction(
  'FETCH_VOLUME_REQUEST',
  'FETCH_VOLUME_SUCCESS',
  'FETCH_VOLUME_FAILURE'
)<void, Array<Storage.Volume>, Error>();

export const addVolume = createAsyncAction(
  'ADD_VOLUME_REQUEST',
  'ADD_VOLUME_SUCCESS',
  'ADD_VOLUME_FAILURE'
)<void, Storage.Volume, Error>();

export const removeVolume = createAsyncAction(
  'REMOVE_VOLUME_REQUEST',
  'REMOVE_VOLUME_SUCCESS',
  'REMOVE_VOLUME_FAILURE'
)<void, { id: string }, Error>();

export const clearVolumeError = createStandardAction('CLEAR_VOLUME_ERROR')<
  void
>();
