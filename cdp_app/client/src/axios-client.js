import axios from 'axios';

// 1) CSRF client only for the initial cookie
export const csrfAxios = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

// 2) Main API client
const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

axiosClient.interceptors.request.use(config => {
  // only attach Bearer if already logged in
  const token = localStorage.getItem('ACCESS_TOKEN');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err)
);

export default axiosClient;
