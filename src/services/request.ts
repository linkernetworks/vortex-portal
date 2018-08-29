import axios from 'axios';
import { loadToken } from '@/utils/auth';

axios.interceptors.request.use(
  config => {
    const { url } = config;
    const rule = /^\/v1\/(?!((registry)|(users\/sign(in|up)))).*/;
    if (url && rule.test(url)) {
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
