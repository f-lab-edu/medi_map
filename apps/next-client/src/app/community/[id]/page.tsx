'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { API_URLS } from '@/constants/urls';
import '@/styles/pages/community/community.scss';
import { Params, Post, Comment } from '@/types/post';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa6";
import Link from 'next/link';

export default function PostDetailPage({ params }: { params: Params }) {
  const { id } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]); // 댓글 목록
  const [newComment, setNewComment] = useState(''); // 새 댓글 내용
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null); // 수정 중인 댓글 ID
  const [editedComment, setEditedComment] = useState(''); // 수정된 댓글 내용
  const [isRecommended, setIsRecommended] = useState(false); // 추천 상태
  const [recommendationCount, setRecommendationCount] = useState(0); // 추천 수

  const { data: session } = useSession(); // 세션에서 사용자 정보 가져오기
  const router = useRouter();

  const userId = session?.user?.id; // 로그인한 사용자 ID
  const accessToken = session?.user?.accessToken; // Access Token

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchRecommendation();
  }, [id]);

  // 게시글 정보 가져오기
  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API_URLS.POSTS}/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('게시글을 불러오는 중 문제가 발생했습니다.');
    }
  };

  // 게시글 삭제
  const handleDeletePost = async () => {
    try {
      if (!window.confirm('정말 삭제하시겠습니까?')) return;

      await axios.delete(`${API_URLS.POSTS}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      alert('게시글이 삭제되었습니다.');
      router.push('/community'); // 삭제 후 목록 페이지로 이동
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('게시글 삭제 중 문제가 발생했습니다.');
    }
  };

  // 댓글 목록 가져오기
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URLS.POSTS}/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      alert('댓글을 불러오는 중 문제가 발생했습니다.');
    }
  };

  // 댓글 추가
  const handleAddComment = async () => {
    try {
      if (!newComment.trim()) {
        alert('댓글 내용을 입력해주세요.');
        return;
      }

      await axios.post(
        `${API_URLS.POSTS}/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setNewComment(''); // 댓글 입력창 초기화
      fetchComments(); // 댓글 목록 새로고침
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('댓글 추가 중 문제가 발생했습니다.');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    try {
      if (!window.confirm('정말 삭제하시겠습니까?')) return;

      await axios.delete(`${API_URLS.POSTS}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      alert('댓글이 삭제되었습니다.');
      fetchComments(); // 댓글 목록 새로고침
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('댓글 삭제 중 문제가 발생했습니다.');
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
        alert('댓글 내용을 입력해주세요.');
        return;
      }

      await axios.put(
        `${API_URLS.POSTS}/comments/${commentId}`,
        { content: editedComment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert('댓글이 수정되었습니다.');

      // 수정 모드 해제 및 상태 초기화
      setEditingCommentId(null);
      setEditedComment('');

      // 댓글 목록 새로고침
      fetchComments();
    } catch (error) {
      console.error('Error editing comment:', error);
      alert('댓글 수정 중 문제가 발생했습니다.');
    }
  };

  // 추천 정보 가져오기
  const fetchRecommendation = async () => {
    try {
      const response = await axios.get(`${API_URLS.POSTS}/${id}/recommend`);
      setIsRecommended(response.data.recommended); // 추천 여부
      setRecommendationCount(response.data.recommendationCount); // 추천 수
    } catch (error) {
      console.error('Error fetching recommendation:', error);
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

      setIsRecommended(response.data.recommended); // 추천 여부 업데이트
      setRecommendationCount((prev) =>
        response.data.recommended ? prev + 1 : prev - 1
      ); // 추천 수 업데이트
    } catch (error) {
      console.error('Error toggling recommendation:', error);
      alert('추천 중 문제가 발생했습니다.');
    }
  };

  if (!post) {
    return <p>게시글을 불러오는 중...</p>;
  }

  return (
    <div className="post_detail">
      <h2 className='post_title'>{post.title}</h2>
      
       {/* 게시글 수정/삭제 버튼 (작성자만 표시) */}
       {post.userId === userId && (
        <div className="post_actions">
          <button className='common_button edit_button' onClick={() => router.push(`/community/${id}/edit`)}>수정</button>
          <button className='common_button delete_button' onClick={handleDeletePost} >삭제</button>
        </div>
      )}
      <p className='post_desc'>{post.content}</p>


      <div className="post_actions">
      <Link href="/community">목록으로</Link> 
        <button onClick={toggleRecommendation} className="recommend_button">
          {isRecommended ? (
            <FaThumbsUp size={24} />
          ) : (
            <FaRegThumbsUp size={24} />
          )}
        </button>
        <span>{recommendationCount}</span>
      </div>

      <div className="comment">
      <h2>댓글</h2>
      <div className="comment_section">
        {/* 댓글 작성 */}
        <div className="add_comment">
          <textarea
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>댓글 추가</button>
        </div>

        {/* 댓글 목록 */}
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
                  <button className='common_button cancel_button' onClick={() => setEditingCommentId(null)}>취소</button>
                  <button className='common_button save_button' onClick={() => handleEditComment(comment.id)}>등록</button>
                  </div>
                </div>
              ) : (
                <div className="comment_item">
                  <div className="top_cont">
                    <p>{comment.author}</p>
                    <span className='date'>{new Date(post.createdAt).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  </div>
                  <div className="comment_desc">
                  <p>{comment.content}</p>
                  
                  </div>
                  {comment.userId === userId && (
                    <div className="comment_actions">
                      <button className='common_button edit_button'
                        onClick={() => startEditingComment(comment.id, comment.content)}
                      >
                        수정
                      </button>
                      <button className='common_button delete_button' onClick={() => handleDeleteComment(comment.id)}>삭제</button>
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
