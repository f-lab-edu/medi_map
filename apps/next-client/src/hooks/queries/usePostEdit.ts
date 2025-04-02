import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/services/common/axiosInstance';
import { API_URLS } from '@/constants/urls';
import { ALERT_MESSAGES } from '@/constants/alertMessage';
import { ERROR_MESSAGES } from '@/constants/errors';

// 게시글 데이터 가져오기
export function usePostEditData(id: string, userId: string) {
  const router = useRouter();
  
  return useSuspenseQuery({
    queryKey: ['post-edit', id, userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`${API_URLS.POSTS}/${id}`);
      const post = response.data;

      if (post.userId !== userId) {
        alert(ALERT_MESSAGES.ERROR.POST.POST_PERMISSION_DENIED);
        router.push('/community');
        throw new Error(ERROR_MESSAGES.PERMISSION_DENIED);
      }
      
      return post;
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
  });
}

// 게시글 업데이트 기능
export function useUpdatePost(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!title.trim() || !content.trim()) {
        alert(ALERT_MESSAGES.ERROR.POST.POST_EMPTY_FIELDS);
        throw new Error(ERROR_MESSAGES.EMPTY_FIELDS);
      }

      return axiosInstance.put(
        `${API_URLS.POSTS}/${id}`,
        { title, content },
        { headers: { requiresAuth: true } }
      );
    },
    onSuccess: () => {
      alert(ALERT_MESSAGES.SUCCESS.POST.POST_UPDATE);
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      router.push(`/community/${id}`);
    },
    onError: (error) => {
      console.error('Error updating post:', error);
      alert(ALERT_MESSAGES.ERROR.POST.POST_UPDATE_ERROR);
    }
  });
}

// 게시글 삭제 기능
export function useDeletePost(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!window.confirm(ALERT_MESSAGES.CONFIRM.CHECK_DELETE)) {
        throw new Error(ERROR_MESSAGES.DELETE_CANCELLED);
      }

      return axiosInstance.delete(`${API_URLS.POSTS}/${id}`, {
        headers: { requiresAuth: true }
      });
    },
    onSuccess: () => {
      alert(ALERT_MESSAGES.SUCCESS.POST.POST_DELETE);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push('/community');
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
      alert(ALERT_MESSAGES.ERROR.POST.POST_DELETE_ERROR);
    }
  });
}

export const usePostEdit = (id: string, userId: string) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const { data } = usePostEditData(id, userId);
  const updatePostMutation = useUpdatePost(id);
  const deletePostMutation = useDeletePost(id);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setContent(data.content);
    }
  }, [data]);

  const handleUpdatePost = () => {
    updatePostMutation.mutate({ title, content });
  };

  const handleDeletePost = () => {
    deletePostMutation.mutate();
  };

  return { title, setTitle, content, setContent, handleUpdatePost, handleDeletePost };
};