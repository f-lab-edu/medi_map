import axios from "axios";

export const handleApiError = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || defaultMessage;
  }
  console.error("[API Error] Unknown Error:", error);
  return defaultMessage;
};