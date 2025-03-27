'use client';

import { Suspense } from 'react';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa6";
import { useRecommend, useToggleRecommend } from '@/hooks/queries/useRecommend';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface RecommendButtonProps {
  urlPostId: string;
}

const RecommendButtonContent = ({ urlPostId }: RecommendButtonProps) => {
  const { data } = useRecommend(urlPostId);
  const toggleRecommend = useToggleRecommend();

  const handleToggle = () => {
    toggleRecommend.mutate(urlPostId);
  };

  return (
    <button className='recommend_button' onClick={handleToggle}>
      {data?.recommended ? <FaThumbsUp size={24} /> : <FaRegThumbsUp size={24} />}
      <span>{data?.recommendationCount}</span>
    </button>
  );
};

const RecommendButton = ({ urlPostId }: RecommendButtonProps) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <RecommendButtonContent urlPostId={urlPostId} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default RecommendButton;