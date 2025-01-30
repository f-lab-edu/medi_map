'use client';

import React, { useState } from 'react';
import { API_URLS } from '@/constants/urls';
import { ALERT_MESSAGES } from '@/constants/alert_message';
import { axiosInstance } from '@/services/axiosInstance';

interface CommentFormProps {
  postId: string;
  fetchComments: () => void;
}

const CommentForm = ({ postId, fetchComments }: CommentFormProps) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert(ALERT_MESSAGES.ERROR.COMMENT.COMMENT_EMPTY_FIELDS);
      return;
    }

    try {
      await axiosInstance.post(`${API_URLS.POSTS}/${postId}/comments`, { content: newComment }, 
        { headers: { requiresAuth: true } }
      );
      setNewComment('');
      fetchComments();
      alert(ALERT_MESSAGES.SUCCESS.COMMENT.COMMENT_ADD);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(ALERT_MESSAGES.ERROR.COMMENT.COMMENT_ADD_ERROR);
    }
  };

  return (
    <div className='comment_section'>
      <div className="add_comment">
        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} />
        <button onClick={handleAddComment}>댓글 추가</button>
      </div>
    </div>
  );
};

export default CommentForm;