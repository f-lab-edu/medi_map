import axios from 'axios';

export const handleApiError = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return error.message || defaultMessage;
  }
  console.error("[API Error] Unknown Error:", error);
  return defaultMessage;
};