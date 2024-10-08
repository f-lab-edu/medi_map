import axios from 'axios';
import { ERROR_MESSAGES } from '@/constants/errors';

export const handleError = (error: unknown, defaultMessage = ERROR_MESSAGES.UNKNOWN_ERROR) => {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || defaultMessage);
  }
  throw new Error(defaultMessage);
};
