'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPost } from '@/utils/PostApi';

export function useFetchPost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}