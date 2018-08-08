import { ActionType, getType } from 'typesafe-actions';
import * as Hub from './actions';

export type HubStateType = Readonly<{
  token: string;
  isAuth: boolean;
  isError?: boolean;
  isLoading: boolean;
  allRepos: Array<string>;
  repos: Array<{
    name: string;
    tags: Array<string>;
  }>;
}>;

export type HubActionType = ActionType<typeof Hub>;

const inititalState: HubStateType = {
  token: '',
  isAuth: false,
  isLoading: false,
  allRepos: [],
  repos: []
};

export function hubReducer(state = inititalState, action: HubActionType) {
  if (state === undefined) {
    return inititalState;
  }

  switch (action.type) {
    case getType(Hub.authRegistry.request):
    case getType(Hub.fetchImageCatalog.request):
    case getType(Hub.fetchImageTags.request):
      return { ...state, isLoading: true };
    case getType(Hub.authRegistry.success):
      return { ...state, ...action.payload, isLoading: false };
    case getType(Hub.authRegistry.failure):
      return { ...state, isError: true, isAuth: false, isLoading: false };
    case getType(Hub.fetchImageCatalog.success):
      return {
        ...state,
        allRepos: action.payload.repositories,
        isLoading: false
      };
    case getType(Hub.fetchImageTags.success):
      return {
        ...state,
        repos: [...state.repos, action.payload],
        isLoading: false
      };
    case getType(Hub.resetAuthError):
      return {
        ...state,
        isError: false
      };
    default:
      return state;
  }
}
