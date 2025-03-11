import '@/styles/pages/community/community.scss';
import { fetchPost } from '@/utils/PostApi';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import PostWrapper from './post-wrapper';

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ['post', params.id],
    queryFn: () => fetchPost(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}> 
      <PostWrapper urlPostId={params.id} />
    </HydrationBoundary>
  );
}