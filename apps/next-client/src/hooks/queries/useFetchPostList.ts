'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/utils/PostListApi';

export function useFetchPosts(page: number, search: string) {
  return useQuery({
    queryKey: ['posts', page, search],
    queryFn: () => fetchPosts({ page, limit: 10, search }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}