'use client';

import React, { Suspense } from 'react';
import { QueryClientProvider, HydrationBoundary, DehydratedState, useQueryClient } from '@tanstack/react-query';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import PostDetail from '@/components/community/PostDetail';

interface Props {
  urlPostId: string;
  dehydratedState: DehydratedState;
}

export default function PostDetailClient({ urlPostId, dehydratedState }: Props) {
  const queryClient = useQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <ErrorBoundary>
            <PostDetail urlPostId={urlPostId} />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}