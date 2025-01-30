import { API_URLS } from '@/constants/urls';
import PostContent from '@/components/community/PostContent';
import PostDetailPage from '@/components/community/PostDetailPage';
import '@/styles/pages/community/community.scss';

async function fetchPost(id: string) {
  const response = await fetch(`${API_URLS.POSTS}/${id}`, { cache: 'no-store' });
  
  if (!response.ok) {
    throw new Error("게시글을 불러올 수 없습니다.");
  }
  return response.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  const post = await fetchPost(params.id);

  return (
    <div className="post_detail">
      <PostContent post={post} />
      <PostDetailPage postId={params.id} userId={post.userId} />
    </div>
  );
}