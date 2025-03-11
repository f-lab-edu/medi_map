import { axiosInstance } from '@/services/axiosInstance';
import { API_URLS } from '@/constants/urls';
import { ALERT_MESSAGES } from '@/constants/alertMessage';
import { ERROR_MESSAGES } from '@/constants/errors';
import { AxiosError } from 'axios';

interface FetchPostsParams {
  page: number;
  limit: number;
  search: string;
}

export const fetchPosts = async ({ page, limit, search }: FetchPostsParams) => {
  try {
    const response = await axiosInstance.get(`${API_URLS.POSTS}`, {
      params: { page, limit, search },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      let errorMessage: string = ALERT_MESSAGES.ERROR.POST.FETCH_POSTS;

      if (error.response?.status === 404) {
        errorMessage = ERROR_MESSAGES.POST_NOT_FOUND;
      } else if (error.response?.status === 500) {
        errorMessage = ERROR_MESSAGES.SERVER_ERROR;
      }

      console.error(errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error('Failed to fetch posts:', error);
      throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }
};