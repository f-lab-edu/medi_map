'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/react'; // useSession 추가
import { API_URLS } from '@/constants/urls';
import '@/styles/pages/community/community.scss';
import { Post } from '@/types/post';

// 게시글 타입 정의
export default function CommunityList() {
  const [posts, setPosts] = useState<Post[]>([]); // 타입 명시
  const { data: session } = useSession(); // NextAuth 세션 사용
  const userId = session?.user?.id; // 세션에서 userId 추출

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get<Post[]>(`${API_URLS.POSTS}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('게시글을 불러오는 중 문제가 발생했습니다.');
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      if (!window.confirm('정말 삭제하시겠습니까?')) return;

      if (!session?.user?.accessToken) {
        alert('로그인 상태를 확인해주세요.');
        return;
      }

      await axios.delete(`${API_URLS.POSTS}/${id}`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` }, // 세션에서 accessToken 사용
      });

      alert('게시글이 삭제되었습니다.');
      fetchPosts(); // 게시글 목록 갱신
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('게시글 삭제 중 문제가 발생했습니다.');
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
                  <td>{index + 1}</td> {/* 번호 */}
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