import axios from 'axios';
import { API_URLS } from '@/constants/urls';

export const axiosInstance = axios.create({
  baseURL: API_URLS.LOGIN,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});