import { RTAction } from '../index';
import { hubActions, HubActionType } from './index';
import * as hubAPI from '@/services/hub';
import { Login } from '@/models/Query';
import { dataToBasicToken } from '@/utils/auth';

export const authRegistry = (data: Login): RTAction<Promise<HubActionType>> => {
  return async dispatch => {
    dispatch(hubActions.authRegistry.request());
    try {
      await hubAPI.getRegistryAuth(data.username, data.password);
      return dispatch(
        hubActions.authRegistry.success({
          isAuth: true,
          token: dataToBasicToken(data)
        })
      );
    } catch (e) {
      return dispatch(hubActions.authRegistry.failure(e));
    }
  };
};

export const fetchImageCatalog = (): RTAction<Promise<HubActionType>> => {
  return async (dispatch, getState) => {
    const token = getState().hub.token;
    dispatch(hubActions.fetchImageCatalog.request());
    try {
      const res = await hubAPI.getHubCatalog(token);
      return dispatch(hubActions.fetchImageCatalog.success(res.data));
    } catch (e) {
      return dispatch(hubActions.fetchImageCatalog.failure(e));
    }
  };
};

export const fetchImageTags = (
  image: string
): RTAction<Promise<HubActionType>> => {
  return async (dispatch, getState) => {
    const token = getState().hub.token;
    dispatch(hubActions.fetchImageTags.request());
    try {
      const res = await hubAPI.getImageTags(token, image);
      return dispatch(hubActions.fetchImageTags.success(res.data));
    } catch (e) {
      return dispatch(hubActions.fetchImageTags.failure(e));
    }
  };
};

export const fetchImagesData = (): RTAction<Promise<void>> => {
  return async (dispatch, getState) => {
    await dispatch(fetchImageCatalog());
    getState().hub.allRepos.map(repo => {
      return dispatch(fetchImageTags(repo));
    });
  };
};
