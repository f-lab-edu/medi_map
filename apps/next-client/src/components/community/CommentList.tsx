import { useState } from 'react';
import { Comment } from '@/types/post';
import { API_URLS } from '@/constants/urls';
import { ALERT_MESSAGES } from '@/constants/alertMessage';
import { axiosInstance } from '@/services/axiosInstance';

interface CommentListProps {
  comments: Comment[];
  userId: string | undefined;
  fetchComments: () => Promise<void>;
}

const CommentList = ({ comments, userId, fetchComments }: CommentListProps) => {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState<string>('');

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm(ALERT_MESSAGES.CONFIRM.CHECK_DELETE)) return;

    try {
      await axiosInstance.delete(`${API_URLS.POSTS}/comments/${commentId}`, {
        headers: { requiresAuth: true },
      });
      alert(ALERT_MESSAGES.SUCCESS.COMMENT.COMMENT_DELETE);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(ALERT_MESSAGES.ERROR.COMMENT.COMMENT_DELETE_ERROR);
    }
  };

  const startEditingComment = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedComment(currentContent);
  };

  const handleEditComment = async (commentId: number) => {
    if (!editedComment.trim()) {
      alert(ALERT_MESSAGES.ERROR.COMMENT.COMMENT_EMPTY_FIELDS);
      return;
    }

    try {
      await axiosInstance.put(
        `${API_URLS.POSTS}/comments/${commentId}`,
        { content: editedComment },
        { headers: { requiresAuth: true } }
      );

      alert(ALERT_MESSAGES.SUCCESS.COMMENT.COMMENT_EDIT);
      setEditingCommentId(null);
      setEditedComment('');
      fetchComments();

    } catch (error) {
      console.error('Error editing comment:', error);
      alert(ALERT_MESSAGES.ERROR.COMMENT.COMMENT_EDIT_ERROR);
    }
  };

  return (
    <ul className="comments_list">
      {comments.map((comment) => (
        <li className='comment_item' key={comment.id}>
          {editingCommentId === comment.id ? (
            <div className='edit_comment'>
              <textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
              />
              <div className="button_box">
                <button className="common_button save_button" onClick={() => handleEditComment(comment.id)}>
                  저장
                </button>
                <button className="common_button cancel_button" onClick={() => setEditingCommentId(null)}>
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className='edit_comment'>
              <div className="top_cont">
                <p>{comment.author}</p>
                <p className='date'>
                  {new Date(comment.createdAt).toLocaleString('ko-KR')}
                </p>
              </div>

              <p>{comment.content}</p>

              {comment.userId === userId && (
                <div className='button_box'>
                  <button className="common_button edit_button" onClick={() => startEditingComment(comment.id, comment.content)}>
                    수정
                  </button>
                  <button className="common_button delete_button" onClick={() => handleDeleteComment(comment.id)}>
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CommentList;