import axios from 'axios';
import { loadToken } from '@/utils/auth';

axios.interceptors.request.use(
  config => {
    const { url } = config;
    if (url && /^\/v1\/(?!registry\/).*/.test(url)) {
      const token = loadToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
