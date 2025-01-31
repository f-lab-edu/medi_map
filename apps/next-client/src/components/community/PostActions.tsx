'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { API_URLS } from '@/constants/urls';
import { axiosInstance } from '@/services/axiosInstance';
import { ALERT_MESSAGES } from '@/constants/alert_message';

interface PostActionsProps {
  postId: number;
  userId: string;
}

const PostActions = ({ postId, userId }: PostActionsProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const handleDeletePost = useCallback(async () => {
    const isConfirmed = window.confirm(ALERT_MESSAGES.CONFIRM.CHECK_DELETE);
    if (!isConfirmed) return;

    try {
      await axiosInstance.delete(`${API_URLS.POSTS}/${postId}`, {
        headers: { requiresAuth: true },
      });

      alert(ALERT_MESSAGES.SUCCESS.POST.POST_DELETE);
      router.push('/community');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(ALERT_MESSAGES.ERROR.POST.POST_DELETE_ERROR);
    }
  }, [postId, router]);

  if (currentUserId !== userId) return null;

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