import '@/styles/pages/community/community.scss';
import { fetchPost } from '@/utils/PostApi';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import PostDetailClient from '@/components/community/PostDetailClient';

interface PageProps {
  params: { id: string };
}

async function getPostDetails(id: string) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
  });
  return dehydrate(queryClient);
}

export default async function Page({ params }: PageProps) {
  const { id } = params;
  const dehydratedState = await getPostDetails(id);

  return (
    <PostDetailClient urlPostId={id} dehydratedState={dehydratedState} />
  );
}