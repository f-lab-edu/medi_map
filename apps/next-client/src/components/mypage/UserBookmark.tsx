import React, { Suspense } from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { UserBookmarkContent } from './UserBookmarkContent';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function UserBookmark() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <UserBookmarkContent />
      </Suspense>
    </ErrorBoundary>
  );
}