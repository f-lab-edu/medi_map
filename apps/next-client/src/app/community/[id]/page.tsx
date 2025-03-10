'use client';

import PostContent from '@/components/community/PostContent';
import PostDetailPage from '@/components/community/PostDetailPage';
import '@/styles/pages/community/community.scss';
import { useFetchPost } from '@/hooks/queries/useFetchPost';
import { Post } from '@/types/post';

export default function Page({ params }: { params: { id: string } }) {
  const { data: post, error } = useFetchPost(params.id);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!post) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="post_detail">
      <PostContent post={post as Post} />
      <PostDetailPage urlPostId={params.id} />
    </div>
  );
}