'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { API_URLS } from '@/constants/urls';
import '@/styles/pages/community/community.scss';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const router = useRouter();
  
  const userId = session?.user?.id;
  const accessToken = session?.user?.accessToken;

  // 게시글 정보 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_URLS.POSTS}/${id}`);
        const post = response.data;

        // 작성자가 아닌 경우 접근 제한
        if (post.userId !== userId) {
          alert('수정 권한이 없습니다.');
          router.push('/community');
          return;
        }

        setTitle(post.title);
        setContent(post.content);
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('게시글을 불러오는 중 문제가 발생했습니다.');
        router.push('/community');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, userId, router]);

  // 게시글 수정
  const handleUpdatePost = async () => {
    try {
      if (!title.trim() || !content.trim()) {
        alert('제목과 내용을 모두 입력해주세요.');
        return;
      }

      await axios.put(
        `${API_URLS.POSTS}/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert('게시글이 수정되었습니다.');
      router.push(`/community/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('게시글 수정 중 문제가 발생했습니다.');
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
      router.push('/community');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('게시글 삭제 중 문제가 발생했습니다.');
    }
  };

  if (loading) {
    return <p>게시글을 불러오는 중...</p>;
  }

  return (
    <div className="edit-post">
      <h1>게시글 수정</h1>
      <div className="edit-form">
        <label htmlFor="title">제목</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="actions">
          <button onClick={handleUpdatePost}>수정 완료</button>
          <button onClick={handleDeletePost} className="delete-button">
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}