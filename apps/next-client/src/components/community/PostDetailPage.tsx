'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { API_URLS } from '@/constants/urls';
import { ALERT_MESSAGES } from '@/constants/alertMessage';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa6";
import Link from 'next/link';
import { axiosInstance } from '@/services/axiosInstance';
import CommentList from '@/components/community/CommentList';
import CommentForm from '@/components/community/CommentForm';

interface Props {
  urlPostId: string;
  userId: string;
}

const PostDetailPage = ({ urlPostId }: Props) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [isRecommended, setIsRecommended] = useState(false);
  const [recommendationCount, setRecommendationCount] = useState(0);
  const currentUserId = session?.user?.id;

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

  useEffect(() => {
    const fetchRecommend = async () => {
      try {
        const response = await axiosInstance.get(`${API_URLS.POSTS}/${urlPostId}/recommend`, {
          headers: { requiresAuth: true },
        });

        setIsRecommended(response.data.recommended);
        setRecommendationCount(response.data.recommendationCount);
      } catch (error) {
        console.error('Error fetching recommend:', error);
        alert(ALERT_MESSAGES.ERROR.UNKNOWN_ERROR);
      }
    };

    fetchRecommend();
  }, [urlPostId]);

  const toggleRecommend = async () => {
    try {
      const response = await axiosInstance.post(
        `${API_URLS.POSTS}/${urlPostId}/recommend`,
        {},
        { headers: { requiresAuth: true } }
      );

      setIsRecommended(response.data.recommended);
      setRecommendationCount(response.data.recommendationCount);
    } catch (error) {
      console.error('Error toggling recommend:', error);
    }
  };

  return (
    <div className='post_bottom_cont'>
      <div className="post_actions">
        <Link className="list_button" href="/community">목록으로</Link>
        <button className='recommend_button' onClick={toggleRecommend}>
          {isRecommended ? <FaThumbsUp size={24} /> : <FaRegThumbsUp size={24} />}
        </button>
        <span>{recommendationCount}</span>
      </div>

      <CommentForm urlPostId={urlPostId} fetchComments={fetchComments} />
      <CommentList comments={comments} userId={currentUserId} fetchComments={fetchComments} />
    </div>
  );
};

export default PostDetailPage;