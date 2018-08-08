import axios, { AxiosPromise } from 'axios';

export const getRegistryAuth = (username: string, password: string) => {
  return axios.post('/v1/registry/auth', {
    username,
    password
  });
};

export const getHubCatalog = (
  token: string
): AxiosPromise<{
  repositories: Array<string>;
}> => {
  return axios.get('/registry/v2/_catalog', {
    headers: {
      Authorization: `Basic ${token}`
    }
  });
};

export const getImageTags = (
  token: string,
  imageName: string
): AxiosPromise<{
  name: string;
  tags: Array<string>;
}> => {
  return axios.get(`/registry/v2/${imageName}/tags/list`, {
    headers: {
      Authorization: `Basic ${token}`
    }
  });
};

export const getImageDetail = (
  token: string,
  imageName: string,
  tag: string
) => {
  return axios.get(`/registry/v2/${imageName}/manifests/${tag}`, {
    headers: {
      Authorization: `Basic ${token}`
    }
  });
};
