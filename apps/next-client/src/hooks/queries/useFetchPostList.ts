import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/utils/PostListApi';

export function useFetchPosts(page: number, search: string) {
  return useSuspenseQuery({
    queryKey: ['posts', page, search],
    queryFn: () => fetchPosts({ page, limit: 10, search }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}