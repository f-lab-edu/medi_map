'use client'; // 최상단에 위치

import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; // 페이지 이동을 위한 useRouter
import { API_URLS } from '@/constants/urls';
import '@/styles/pages/community/community.scss';

export default function CreatePost() {
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const router = useRouter(); // 페이지 이동을 위한 라우터

  // 게시글 작성 요청
  const handleCreatePost = async () => {
    try {
      // 제목과 내용이 비어 있는지 확인
      if (!newPost.title || !newPost.content) {
        alert('제목과 내용을 입력해주세요.');
        return;
      }

      // 서버에 게시글 생성 요청
      await axios.post(
        `${API_URLS.POSTS}`,
        newPost,
        {
          headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
        }
      );

      alert('게시글이 작성되었습니다.');
      router.push('/community'); // 게시글 작성 후 목록 페이지로 이동
    } catch (error) {
      console.error('Error creating post:', error);
      alert('게시글 작성 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="create-post">
      <h1>글쓰기</h1>
      <div className="form-group">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
      </div>
      <div className="form-group">
        <textarea
          placeholder="내용을 입력하세요"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
      </div>
      <button onClick={handleCreatePost}>작성하기</button>
    </div>
  );
}
