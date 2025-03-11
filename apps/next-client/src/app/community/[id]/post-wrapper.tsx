'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPost } from '@/utils/PostApi';
import { Post } from '@/types/post';
import PostContent from '@/components/community/PostContent';
import PostDetailPage from '@/components/community/PostDetailPage';

interface Props {
  urlPostId: string;
}

export default function PostWrapper({ urlPostId }: Props) {
  const { data: post, isError, isLoading } = useQuery({
    queryKey: ['post', urlPostId],
    queryFn: () => fetchPost(urlPostId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError || !post) {
    return <div>Error: 데이터를 불러오는 데 실패했습니다.</div>;
  }

  return (
    <div className="post_detail">
      <PostContent post={post as Post} />
      <PostDetailPage urlPostId={urlPostId} />
    </div>
  );
}