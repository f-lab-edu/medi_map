import React, { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import '@/styles/pages/community/community.scss';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EditPostContent from '@/components/community/EditPostContent';
import { authOptions } from '@/app/auth/authOptions';
import { ERROR_MESSAGES } from '@/constants/errors';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error(ERROR_MESSAGES.LOGIN_REQUIRED);
  }
  
  const userId = session.user.id;

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <EditPostContent params={params} userId={userId} />
      </Suspense>
    </ErrorBoundary>
  );
}