import { verify } from '@/services/user';
import { JWTTOKEN, User } from '@/models/User';

export function dataToBasicToken(data: { username: string; password: string }) {
  return btoa(`${data.username}:${data.password}`);
}

export function basicTokenToData(token: string) {
  const raw = atob(token).split(':');
  return {
    username: raw[0],
    password: raw[1]
  };
}

export async function findSavedAuthToken(): Promise<{
  token: string;
  user: User;
}> {
  const token = localStorage.getItem(JWTTOKEN);

  if (token) {
    try {
      const res = await verify(token);
      return {
        token,
        user: res.data
      };
    } catch (e) {
      return Promise.reject();
    }
  }

  return Promise.reject();
}

export function saveToken(token: string) {
  localStorage.setItem(JWTTOKEN, token);
}

export function removeToken() {
  localStorage.removeItem(JWTTOKEN);
}
