import { API_URLS } from '@/constants/urls';
import PostContent from '@/components/community/PostContent';
import PostDetailPage from '@/components/community/PostDetailPage';
import '@/styles/pages/community/community.scss';
import { ERROR_MESSAGES } from '@/constants/errors';
import { AxiosError } from 'axios';
import { axiosInstance } from '@/services/axiosInstance';

async function fetchPost(id: string) {
  try {
    const response = await axiosInstance.get(`${API_URLS.POSTS}/${id}`, {
      headers: { 'Cache-Control': 'no-store' },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      let errorMessage: string = ERROR_MESSAGES.CLIENT_ERROR;

      if (error.response?.status === 404) {
        errorMessage = ERROR_MESSAGES.POST_NOT_FOUND;
      } else if (error.response?.status === 500) {
        errorMessage = ERROR_MESSAGES.SERVER_ERROR;
      }

      console.error(errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error("Failed to fetch post:", error);
      throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const post = await fetchPost(params.id);

  return (
    <div className="post_detail">
      <PostContent post={post} />
      <PostDetailPage urlPostId={params.id} />
    </div>
  );
}