import axios from 'axios';
import Cookies from 'js-cookie';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = Cookies.get("accessToken");

  if (accessToken && config.headers?.requiresAuth) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});