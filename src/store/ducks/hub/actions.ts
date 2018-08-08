import { createAsyncAction, createStandardAction } from 'typesafe-actions';

export const resetAuthError = createStandardAction('RESET_AUTH_ERROR')<void>();

export const authRegistry = createAsyncAction(
  'AUTH_REGISTRY_REQUEST',
  'AUTH_REGISTRY_SUCCESS',
  'AUTH_REGISTRY_FAILURE'
)<
  void,
  {
    isAuth: boolean;
    token?: string;
  },
  Error
>();

export const fetchImageCatalog = createAsyncAction(
  'FETCH_IMAGE_CATALOG_REQUEST',
  'FETCH_IMAGE_CATALOG_SUCCESS',
  'FETCH_IMAGE_CATALOG_FAILURE'
)<void, { repositories: Array<string> }, Error>();

export const fetchImageTags = createAsyncAction(
  'FETCH_IMAGE_TAGS_REQUEST',
  'FETCH_IMAGE_TAGS_SUCCESS',
  'FETCH_IMAGE_TAGS_FAILURE'
)<
  void,
  {
    name: string;
    tags: Array<string>;
  },
  Error
>();
