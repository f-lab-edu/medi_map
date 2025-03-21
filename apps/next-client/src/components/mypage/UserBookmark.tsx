import React, { Suspense } from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { UserBookmarkContent } from './UserBookmarkContent';

export default function UserBookmark() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>로딩 중...</div>}>
        <UserBookmarkContent />
      </Suspense>
    </ErrorBoundary>
  );
}