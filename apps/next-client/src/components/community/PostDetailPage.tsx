'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { API_URLS } from '@/constants/urls';
import { ALERT_MESSAGES } from '@/constants/alert_message';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa6";
import Link from 'next/link';
import { axiosInstance } from '@/services/axiosInstance';
import CommentList from '@/components/community/CommentList';
import CommentForm from '@/components/community/CommentForm';

interface Props {
  postId: string;
  userId: string;
}

const PostDetailPage = ({ postId }: Props) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [isRecommended, setIsRecommended] = useState(false);
  const [recommendCount, setRecommendCount] = useState(0);
  const currentUserId = session?.user?.id;

  const fetchComments = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`${API_URLS.POSTS}/${postId}/comments`, 
        {
          headers: { requiresAuth: true },
        });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      alert(ALERT_MESSAGES.ERROR.COMMENT.FETCH_COMMENTS);
    }
  }, [postId]);
  
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);  

  useEffect(() => {
    const fetchRecommend = async () => {
      try {
        const response = await axiosInstance.get(`${API_URLS.POSTS}/${postId}/recommend`, {
          headers: { requiresAuth: true },
        });
        setIsRecommended(response.data.recommended);
        setRecommendCount(response.data.recommendCount);
      } catch (error) {
        console.error('Error fetching recommend:', error);
        alert(ALERT_MESSAGES.ERROR.UNKNOWN_ERROR);
      }
    };
  
    fetchRecommend();
  }, [postId]);  

  const toggleRecommend = async () => {
    try {
      const response = await axiosInstance.post(`${API_URLS.POSTS}/${postId}/recommend`, {
        headers: { requiresAuth: true },
      });
      setIsRecommended(response.data.recommended);
      setRecommendCount(response.data.recommendCount);
    } catch (error) {
      console.error('Error toggling recommend:', error);
    }
  };

  return (
    <div className='post_bottom_cont'>
      <div className="post_actions">
        <Link className="list_button" href="/community">목록으로</Link>
        <button onClick={toggleRecommend}>
          {isRecommended ? <FaThumbsUp size={24} /> : <FaRegThumbsUp size={24} />}
        </button>
        <span>{recommendCount}</span>
      </div>

      <CommentForm postId={postId} fetchComments={fetchComments} />
      <CommentList comments={comments} userId={currentUserId} fetchComments={fetchComments} />
    </div>
  );
};

export default PostDetailPage;