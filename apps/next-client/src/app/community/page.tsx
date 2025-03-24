import React, { Suspense } from 'react';
import CommunityList from '@/components/community/CommunityList';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function CommunityPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="loading_message">로딩 중...</div>}>
        <CommunityList />
      </Suspense>
    </ErrorBoundary>
  );
}