'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API_URLS } from '@/constants/urls';
import '@/styles/pages/community/community.scss';
import { Post } from '@/types/post';
import { ALERT_MESSAGES } from '@/constants/alert_message';

export default function CommunityList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get<Post[]>(`${API_URLS.POSTS}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert(ALERT_MESSAGES.ERROR.POST.FETCH_POSTS);
    }
  };

  return (
    <div className="community">
      <h1>커뮤니티</h1>
      <p className='sub_title'>자유롭게 건강에 관련 지식을 공유해봅시다!</p>

      <Link href="/community/create" className='create_post'>
        <button>글쓰기</button>
      </Link>

      <div className="post_list">
        {posts.length === 0 ? (
          <p>게시글이 없습니다.</p>
        ) : (
          <table className="post_table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성일</th>
                <th>작성자</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr key={post.id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link href={`/community/${post.id}`}>
                      {post.title}
                    </Link>
                  </td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>{post.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}