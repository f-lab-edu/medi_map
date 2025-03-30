import { useState } from 'react';
import { Comment } from '@/types/post';
import { useDeleteComment, useEditComment } from '@/hooks/queries/useComments';
import { ALERT_MESSAGES } from '@/constants/alertMessage';

interface CommentListProps {
  comments: Comment[];
  userId: string | undefined;
  urlPostId: string;
}

const CommentList = ({ comments, userId, urlPostId }: CommentListProps) => {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState<string>('');

  const deleteCommentMutation = useDeleteComment(urlPostId);
  const editCommentMutation = useEditComment(urlPostId);

  const handleDeleteComment = (commentId: number) => {
    if (!window.confirm(ALERT_MESSAGES.CONFIRM.CHECK_DELETE)) return;
    deleteCommentMutation.mutate(commentId);
  };

  const handleEditComment = (commentId: number) => {
    if (!editedComment.trim()) {
      alert(ALERT_MESSAGES.ERROR.COMMENT.COMMENT_EMPTY_FIELDS);
      return;
    }
    editCommentMutation.mutate({ commentId, content: editedComment });
    setEditingCommentId(null);
    setEditedComment('');
  };

  return (
    <ul className="comments_list">
      {comments.map((comment) => (
        <li className="comment_item" key={comment.id}>
          {editingCommentId === comment.id ? (
            <div className="edit_comment">
              <textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
              />
              <div className="button_box">
                <button
                  className="common_button save_button"
                  onClick={() => handleEditComment(comment.id)}
                >
                  저장
                </button>
                <button
                  className="common_button cancel_button"
                  onClick={() => setEditingCommentId(null)}
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className="edit_comment">
              <div className="top_cont">
                <p>{comment.author}</p>
                <p className="date">
                  {new Date(comment.createdAt).toLocaleString('ko-KR')}
                </p>
              </div>
              <p>{comment.content}</p>
              {comment.userId === userId && (
                <div className="button_box">
                  <button
                    className="common_button edit_button"
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditedComment(comment.content);
                    }}
                  >
                    수정
                  </button>
                  <button
                    className="common_button delete_button"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
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