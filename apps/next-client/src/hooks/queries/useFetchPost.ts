'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPost } from '@/utils/PostApi';

export function useFetchPost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}