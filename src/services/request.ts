import axios from 'axios';
import { loadToken } from '@/utils/auth';

axios.interceptors.request.use(
  config => {
    const token = loadToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);
