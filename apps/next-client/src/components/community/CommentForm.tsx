'use client';

import { useState } from 'react';
import { useAddComment } from '@/hooks/queries/useComments';
import { ALERT_MESSAGES } from '@/constants/alertMessage';

interface CommentFormProps {
  urlPostId: string;
}

const CommentForm = ({ urlPostId }: CommentFormProps) => {
  const [newComment, setNewComment] = useState('');
  const addCommentMutation = useAddComment(urlPostId);

  const handleAddComment = () => {
    if (!newComment.trim()) {
      alert(ALERT_MESSAGES.ERROR.COMMENT.COMMENT_EMPTY_FIELDS);
      return;
    }
    addCommentMutation.mutate(newComment, {
      onSuccess: () => {
        setNewComment('');
        alert(ALERT_MESSAGES.SUCCESS.COMMENT.COMMENT_ADD);
      },
    });
  };

  return (
    <div className="comment_section">
      <div className="add_comment">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>댓글 추가</button>
      </div>
    </div>
  );
};

export default CommentForm;