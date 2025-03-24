import { API_URLS } from '@/constants/urls';
import { ERROR_MESSAGES } from '@/constants/errors';
import { AxiosError } from 'axios';
import { axiosInstance } from '@/services/axiosInstance';
import { Post } from '@/types/post';

export async function fetchPost(id: string): Promise<Post> {
  try {
    const response = await axiosInstance.get(`${API_URLS.POSTS}/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      let errorMessage: string = ERROR_MESSAGES.CLIENT_ERROR;

      if (error.response?.status === 404) {
        errorMessage = ERROR_MESSAGES.POST_NOT_FOUND;
      } else if (error.response?.status === 500) {
        errorMessage = ERROR_MESSAGES.SERVER_ERROR;
      }

      console.error(errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error('Failed to fetch post:', error);
      throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }
}