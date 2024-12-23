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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page: number = 1) => {
    try {
      const response = await axios.get(`${API_URLS.POSTS}?page=${page}&limit=${postsPerPage}`);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert(ALERT_MESSAGES.ERROR.POST.FETCH_POSTS);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                  <td>{index + 1 + (currentPage - 1) * postsPerPage}</td>
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

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &lt; 
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={index + 1 === currentPage ? 'active' : ''}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}