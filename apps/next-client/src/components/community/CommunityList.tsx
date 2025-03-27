'use client';

import React, { useState, useEffect } from 'react';
import { useFetchPosts } from '@/hooks/queries/useFetchPostList';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import '@/styles/pages/community/community.scss';
import Image from 'next/image';
import { Post } from '@/types/post';
import { ALERT_MESSAGES } from '@/constants/alertMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function CommunityList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(Number(searchParams?.get('page')) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(Cookies.get('accessToken')));
  }, []);

  const { data } = useFetchPosts(currentPage, searchQuery);
  const posts: Post[] = data.posts || [];
  const totalPages = data.totalPages || 1;
  const postsPerPage = 10;

  const updateURL = (page: number, search: string) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (search) params.set('search', search);
    router.push(`/community?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, searchQuery);
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCurrentPage(1);
    updateURL(1, searchTerm);
  };

  const handlePostClick = async (postId: number) => {
    if (!isLoggedIn) {
      alert(ALERT_MESSAGES.ERROR.AUTH.LOGIN_REQUIRED);
      return;
    }
    setIsLoading(true);
    await router.push(`/community/${postId}`);
    setIsLoading(false);
  };

  return (
    <div className="community">
      <h1>커뮤니티</h1>
      <p className="sub_title">자유롭게 건강에 관련 지식을 공유해봅시다!</p>

      <div className="search_box">
        <input
          type="text"
          title="검색어를 입력하세요."
          id="search"
          name="search"
          value={searchTerm}
          className="inp-text"
          placeholder="제목을 입력해주세요."
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn-search" type="button" onClick={handleSearch}>
          <span className="dn">검색</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : posts.length === 0 ? (
        <p className="empty">게시글이 없습니다.</p>
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
            {posts.map((post: Post, index: number) => (
              <tr key={post.id}>
                <td>{(currentPage - 1) * postsPerPage + index + 1}</td>
                <td className="title" onClick={() => handlePostClick(post.id)}>
                  {post.title}
                  <span className="comment">({post.commentCount || 0})</span>
                </td>
                <td className="date">
                  {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </td>
                <td className="author">{post.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isLoggedIn && (
        <Link href="/community/create" className="create_post">
          <button>글쓰기</button>
        </Link>
      )}

      <div className="pagination">
        <button
          className={`arrow left ${currentPage === 1 ? 'blind' : ''}`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <Image src="/images/icon_right_arrow.png" alt="arrow_button" width={6} height={9} />
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
          className={`arrow right ${currentPage === totalPages ? 'blind' : ''}`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <Image src="/images/icon_right_arrow.png" alt="arrow_button" width={6} height={9} />
        </button>
      </div>
    </div>
  );
}