import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/services/axiosInstance';
import Cookies from 'js-cookie';
import { API_URLS } from '@/constants/urls';
import { ALERT_MESSAGES } from '@/constants/alertMessage';

export function useCreatePost(newPost: { title: string; content: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleCreatePost = useCallback(async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert(ALERT_MESSAGES.ERROR.POST.POST_EMPTY_FIELDS);
      return;
    }
    try {
      await axiosInstance.post(API_URLS.POSTS, newPost, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      alert(ALERT_MESSAGES.SUCCESS.POST.POST_CREATE);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push("/community");
    } catch (error) {
      console.error("글 작성 실패:", error);
      alert(ALERT_MESSAGES.ERROR.POST.POST_CREATE_ERROR);
    }
  }, [newPost, router, queryClient]);

  return handleCreatePost;
}