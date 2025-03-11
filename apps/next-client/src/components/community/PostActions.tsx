'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { API_URLS } from '@/constants/urls';
import { axiosInstance } from '@/services/axiosInstance';
import { ALERT_MESSAGES } from '@/constants/alertMessage';

interface PostActionsProps {
  postId: number;
  userId: string;
}

const PostActions = ({ postId, userId }: PostActionsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;

  if (status === 'loading' || currentUserId !== userId) return null;

  const handleDeletePost = async () => {
    const isConfirmed = window.confirm(ALERT_MESSAGES.CONFIRM.CHECK_DELETE);
    if (!isConfirmed) return;

    try {
      await axiosInstance.delete(`${API_URLS.POSTS}/${postId}`, {
        headers: { requiresAuth: true },
      });

      alert(ALERT_MESSAGES.SUCCESS.POST.POST_DELETE);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push('/community');
      
    } catch (error: unknown) {
      console.error('Error deleting post:', error);
      alert(ALERT_MESSAGES.ERROR.POST.POST_DELETE_ERROR);
    }
  };

  return (
    <div className="post_actions">
      <button className="common_button edit_button" onClick={() => router.push(`/community/${postId}/edit`)}>
        수정
      </button>
      <button className="common_button delete_button" onClick={handleDeletePost}>
        삭제
      </button>
    </div>
  );
};

export default PostActions;