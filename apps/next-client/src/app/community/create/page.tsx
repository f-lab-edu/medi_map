'use client';

import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { API_URLS } from '@/constants/urls';
import '@/styles/pages/community/community.scss';
import { ALERT_MESSAGES } from '@/constants/alert_message';

export default function CreatePost() {
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const router = useRouter();

  const handleCreatePost = async () => {
    try {
      if (!newPost.title || !newPost.content) {
        alert(ALERT_MESSAGES.ERROR.POST.POST_EMPTY_FIELDS);
        return;
      }

      await axios.post(
        `${API_URLS.POSTS}`,
        newPost,
        {
          headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
        }
      );

      alert(ALERT_MESSAGES.ERROR.POST.POST_CREATE);
      router.push('/community');
    } catch (error) {
      console.error('Error creating post:', error);
      alert(ALERT_MESSAGES.ERROR.POST.POST_CREATE_ERROR);
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
