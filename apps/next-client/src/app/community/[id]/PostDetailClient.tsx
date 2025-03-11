'use client';

import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider, HydrationBoundary, DehydratedState } from '@tanstack/react-query';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import PostDetail from './PostDetail';

interface Props {
  urlPostId: string;
  dehydratedState: DehydratedState;
}

const queryClient = new QueryClient();

export default function PostDetailClient({ urlPostId, dehydratedState }: Props) {
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