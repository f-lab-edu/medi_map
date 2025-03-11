'use client';

import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/services/axiosInstance';
import { API_URLS } from '@/constants/urls';
import { ALERT_MESSAGES } from '@/constants/alertMessage';

interface FetchPostsParams {
  page: number;
  limit: number;
  search: string;
}

const fetchPosts = async ({ page, limit, search }: FetchPostsParams) => {
  try {
    const response = await axiosInstance.get(`${API_URLS.POSTS}`, {
      params: { page, limit, search },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error(ALERT_MESSAGES.ERROR.POST.FETCH_POSTS);
  }
};

export function useFetchPosts(page: number, search: string) {
  return useQuery({
    queryKey: ['posts', page, search],
    queryFn: () => fetchPosts({ page, limit: 10, search }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 10
  });
}