'use client';

import React, { Suspense } from 'react';
import { useSession } from 'next-auth/react';
import '@/styles/pages/community/community.scss';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EditPostContent from '@/components/community/EditPostContent';
import { ERROR_MESSAGES } from '@/constants/errors';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const accessToken = session?.user?.accessToken || '';

  if (!userId) {
    throw new Error(ERROR_MESSAGES.LOGIN_REQUIRED);
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <EditPostContent params={params} userId={userId} accessToken={accessToken} />
      </Suspense>
    </ErrorBoundary>
  );
}