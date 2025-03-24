'use client';

import React from 'react';
import { useFetchPost } from '@/hooks/queries/useFetchPost';
import { Post } from '@/types/post';
import PostContent from '@/components/community/PostContent';
import PostDetailPage from '@/components/community/PostDetailPage';

interface Props {
  urlPostId: string;
}

export default function PostDetail({ urlPostId }: Props) {
  const { data: post } = useFetchPost(urlPostId);

  return (
    <div className="post_detail">
      <PostContent post={post as Post} />
      <PostDetailPage urlPostId={urlPostId} />
    </div>
  );
}