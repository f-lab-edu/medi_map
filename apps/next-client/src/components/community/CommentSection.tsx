import { useState, useEffect, useCallback } from 'react';
import { API_URLS } from '@/constants/urls';
import { ALERT_MESSAGES } from '@/constants/alertMessage';
import { axiosInstance } from '@/services/axiosInstance';
import CommentList from '@/components/community/CommentList';
import CommentForm from '@/components/community/CommentForm';

interface Props {
  urlPostId: string;
  userId: string;
}

const Comments = ({ urlPostId, userId }: Props) => {
  const [comments, setComments] = useState([]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`${API_URLS.POSTS}/${urlPostId}/comments`, {
        headers: { requiresAuth: true },
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      alert(ALERT_MESSAGES.ERROR.COMMENT.FETCH_COMMENTS);
    }
  }, [urlPostId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <>
      <CommentForm urlPostId={urlPostId} fetchComments={fetchComments} />
      <CommentList comments={comments} userId={userId} fetchComments={fetchComments} />
    </>
  );
};

export default Comments;