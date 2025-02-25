import { API_URLS } from '@/constants/urls';
import PostContent from '@/components/community/PostContent';
import PostDetailPage from '@/components/community/PostDetailPage';
import '@/styles/pages/community/community.scss';
import { ERROR_MESSAGES } from '@/constants/errors';

async function fetchPost(id: string) {
  const response = await fetch(`${API_URLS.POSTS}/${id}`, { cache: 'no-store' });
  
  if (!response.ok) {
    let errorMessage = `게시글을 불러올 수 없습니다. 상태 코드: ${response.status}`;

    if (response.status === 404) {
      errorMessage = ERROR_MESSAGES.POST_NOT_FOUND;
    } else if (response.status === 500) {
      errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  return response.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  const post = await fetchPost(params.id);

  return (
    <div className="post_detail">
      <PostContent post={post} />
      <PostDetailPage urlPostId={params.id} userId={post.userId} />
    </div>
  );
}