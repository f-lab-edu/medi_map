import React, { Suspense } from 'react';
import CommunityList from '@/components/community/CommunityList';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function CommunityPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <CommunityList />
      </Suspense>
    </ErrorBoundary>
  );
}