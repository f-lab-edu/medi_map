import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/services/common/axiosInstance';
import { API_URLS } from '@/constants/urls';
import { ALERT_MESSAGES } from '@/constants/alertMessage';

export const usePostEdit = (id: string, userId: string | undefined, accessToken: string) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  // 게시글 조회 - useSuspenseQuery 사용 (enabled 옵션 제거)
  const { data } = useSuspenseQuery({
    queryKey: ['post-edit', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`${API_URLS.POSTS}/${id}`);
      const post = response.data;

      if (post.userId !== userId) {
        alert(ALERT_MESSAGES.ERROR.POST.POST_PERMISSION_DENIED);
        router.push('/community');
        throw new Error('Permission denied');
      }
      
      return post;
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
  });

  // 데이터로부터 상태 설정
  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setContent(data.content);
    }
  }, [data]);

  // 게시글 업데이트
  const updatePostMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim() || !content.trim()) {
        alert(ALERT_MESSAGES.ERROR.POST.POST_EMPTY_FIELDS);
        throw new Error('Empty fields');
      }

      return axiosInstance.put(
        `${API_URLS.POSTS}/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${accessToken}` } }
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

  // 게시글 삭제
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      if (!window.confirm(ALERT_MESSAGES.CONFIRM.CHECK_DELETE)) {
        throw new Error('Delete cancelled');
      }

      return axiosInstance.delete(`${API_URLS.POSTS}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
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

  const handleUpdatePost = () => {
    updatePostMutation.mutate();
  };

  const handleDeletePost = () => {
    deletePostMutation.mutate();
  };

  return { title, setTitle, content, setContent, handleUpdatePost, handleDeletePost };
};