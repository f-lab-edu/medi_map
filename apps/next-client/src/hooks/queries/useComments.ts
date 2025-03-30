import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/services/common/axiosInstance';
import { API_URLS } from '@/constants/urls';

// 댓글 목록 가져오기
export function useFetchComments(postId: string) {
  return useSuspenseQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await axiosInstance.get(`${API_URLS.POSTS}/${postId}/comments`, {
        headers: { requiresAuth: true },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// 댓글 작성
export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      await axiosInstance.post(
        `${API_URLS.POSTS}/${postId}/comments`,
        { content },
        { headers: { requiresAuth: true } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}

// 댓글 삭제
export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number) => {
      await axiosInstance.delete(`${API_URLS.POSTS}/comments/${commentId}`, {
        headers: { requiresAuth: true },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}

// 댓글 수정
export function useEditComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number; content: string }) => {
      await axiosInstance.put(
        `${API_URLS.POSTS}/comments/${commentId}`,
        { content },
        { headers: { requiresAuth: true } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}