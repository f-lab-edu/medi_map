'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { API_URLS } from '@/constants/urls';
import '@/styles/pages/community/community.scss';
import { Params, Post, Comment } from '@/types/post';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa6";
import Link from 'next/link';
import { ALERT_MESSAGES } from '@/constants/alert_message';

export default function PostDetailPage({ params }: { params: Params }) {
  const { id } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [recommendationCount, setRecommendationCount] = useState(0);

  const { data: session } = useSession();
  const router = useRouter();

  const userId = session?.user?.id;
  const accessToken = session?.user?.accessToken;

  // 게시글 정보 가져오기
  const fetchPost = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URLS.POSTS}/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      alert(ALERT_MESSAGES.ERROR.POST.FETCH_POSTS);
    }
  }, [id]);

  // 댓글 목록 가져오기
  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URLS.POSTS}/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      alert(ALERT_MESSAGES.ERROR.COMMENT.FETCH_COMMENTS);
    }
  }, [id]);

  // 추천 정보 가져오기
  const fetchRecommendation = useCallback(async () => {
    try {
      // 토큰 포함
      const response = await axios.get(
        `${API_URLS.POSTS}/${id}/recommend`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setIsRecommended(response.data.recommended);
      setRecommendationCount(response.data.recommendationCount);
    } catch (error) {
      console.error('Error fetching recommendation:', error);
    }
  }, [id, accessToken]);  

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchRecommendation();
  }, [fetchPost, fetchComments, fetchRecommendation]);

  // 게시글 삭제
  const handleDeletePost = async () => {
    try {
      if (!window.confirm(ALERT_MESSAGES.CONFIRM.CHECK_DELETE)) return;

      await axios.delete(`${API_URLS.POSTS}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      alert(ALERT_MESSAGES.SUCCESS.POST.POST_DELETE);
      router.push('/community');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(ALERT_MESSAGES.ERROR.POST.POST_DELETE_ERROR);
    }
  };

  // 댓글 추가
  const handleAddComment = async () => {
    try {
      if (!newComment.trim()) {
        alert(ALERT_MESSAGES.ERROR.COMMENT.COMMENT_EMPTY_FIELDS);
        return;
      }

      await axios.post(
        `${API_URLS.POSTS}/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(ALERT_MESSAGES.ERROR.COMMENT.COMMENT_ADD_ERROR);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    try {
      if (!window.confirm(ALERT_MESSAGES.CONFIRM.CHECK_DELETE)) return;

      await axios.delete(`${API_URLS.POSTS}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      alert(ALERT_MESSAGES.SUCCESS.COMMENT.COMMENT_DELETE);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(ALERT_MESSAGES.ERROR.COMMENT.COMMENT_DELETE_ERROR);
    }
  };

  // 댓글 수정 시작
  const startEditingComment = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedComment(currentContent);
  };

  // 댓글 수정 요청
  const handleEditComment = async (commentId: number) => {
    try {
      if (!editedComment.trim()) {
        alert(ALERT_MESSAGES.ERROR.COMMENT.COMMENT_EMPTY_FIELDS);
        return;
      }

      await axios.put(
        `${API_URLS.POSTS}/comments/${commentId}`,
        { content: editedComment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
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

  // 추천 토글
  const toggleRecommendation = async () => {
    try {
      const response = await axios.post(
        `${API_URLS.POSTS}/${id}/recommend`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
  
      setIsRecommended(response.data.recommended);
      setRecommendationCount(response.data.recommendationCount);
    } catch (error) {
      console.error('Error toggling recommendation:', error);
      alert(ALERT_MESSAGES.ERROR.UNKNOWN_ERROR);
    }
  };
  

  if (!post) {
    return <p>게시글을 불러오는 중...</p>;
  }

  return (
    <div className="post_detail">
      <h2 className="post_title">{post.title}</h2>
      <span className="post_date">
        {new Date(post.createdAt).toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </span>

      {post.userId === userId && (
        <div className="post_actions">
          <button className="common_button edit_button" onClick={() => router.push(`/community/${id}/edit`)}>
            수정
          </button>
          <button className="common_button delete_button" onClick={handleDeletePost}>
            삭제
          </button>
        </div>
      )}
      <div
        className="post_desc"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="post_actions">
        <Link className='list_button' href="/community">목록으로</Link>
        <button onClick={toggleRecommendation} className="recommend_button">
          {isRecommended ? <FaThumbsUp size={24} /> : <FaRegThumbsUp size={24} />}
        </button>
        <span>{recommendationCount}</span>
      </div>

      <div className="comment">
        <h2>댓글</h2>
        <div className="comment_section">
          <div className="add_comment">
            <textarea
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>댓글 추가</button>
          </div>

          <ul className="comments_list">
            {comments.map((comment) => (
              <li key={comment.id}>
                {editingCommentId === comment.id ? (
                  <div className="edit_comment">
                    <textarea
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                    />
                    <div className="button_box">
                      <button className="common_button cancel_button" onClick={() => setEditingCommentId(null)}>
                        취소
                      </button>
                      <button className="common_button save_button" onClick={() => handleEditComment(comment.id)}>
                        등록
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="comment_item">
                    <div className="top_cont">
                      <p>{comment.author}</p>
                      <span className="date">
                        {new Date(comment.createdAt).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </span>
                    </div>
                    <div className="comment_desc">
                      <p>{comment.content}</p>
                    </div>
                    {comment.userId === userId && (
                      <div className="comment_actions">
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
        </div>
      </div>
    </div>
  );
}