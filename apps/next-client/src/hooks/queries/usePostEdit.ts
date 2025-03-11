import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/services/axiosInstance';
import { API_URLS } from '@/constants/urls';
import { ALERT_MESSAGES } from '@/constants/alertMessage';

export const usePost = (id: string, userId: string | undefined, accessToken: string) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    // 게시글 가져오기 함수
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`${API_URLS.POSTS}/${id}`);
        const post = response.data;

        if (post.userId !== userId) {
          alert(ALERT_MESSAGES.ERROR.POST.POST_PERMISSION_DENIED);
          router.push('/community');
          return;
        }

        setTitle(post.title);
        setContent(post.content);
      } catch (error) {
        console.error('Error fetching post:', error);
        alert(ALERT_MESSAGES.ERROR.POST.POST_FETCH_ERROR);
        router.push('/community');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, userId, router]);

  // 게시글 업데이트 함수
  const handleUpdatePost = async () => {
    try {
      if (!title.trim() || !content.trim()) {
        alert(ALERT_MESSAGES.ERROR.POST.POST_EMPTY_FIELDS);
        return;
      }

      await axiosInstance.put(
        `${API_URLS.POSTS}/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert(ALERT_MESSAGES.SUCCESS.POST.POST_UPDATE);

      queryClient.invalidateQueries({ queryKey: ['post', id] });

      router.push(`/community/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      alert(ALERT_MESSAGES.ERROR.POST.POST_UPDATE_ERROR);
    }
  };

  // 게시글 삭제 함수
  const handleDeletePost = async () => {
    try {
      if (!window.confirm(ALERT_MESSAGES.CONFIRM.CHECK_DELETE)) return;

      await axiosInstance.delete(`${API_URLS.POSTS}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      alert(ALERT_MESSAGES.SUCCESS.POST.POST_DELETE);
      router.push('/community');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(ALERT_MESSAGES.ERROR.POST.POST_DELETE_ERROR);
    }
  };

  return { title, setTitle, content, setContent, loading, handleUpdatePost, handleDeletePost };
};