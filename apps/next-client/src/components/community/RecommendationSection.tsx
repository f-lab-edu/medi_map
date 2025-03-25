import { Suspense } from 'react';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa6";
import { useRecommend, useToggleRecommend } from '@/hooks/queries/useRecommend';
import ErrorBoundary from '@/components/common/ErrorBoundary';

interface Props {
  urlPostId: string;
}

const RecommendationContent = ({ urlPostId }: Props) => {
  const { data } = useRecommend(urlPostId);
  const toggleRecommend = useToggleRecommend();

  const handleToggle = () => {
    toggleRecommend.mutate(urlPostId);
  };

  return (
    <div>
      <button className='recommend_button' onClick={handleToggle}>
        {data?.recommended ? <FaThumbsUp size={24} /> : <FaRegThumbsUp size={24} />}
      </button>
      <span>{data?.recommendationCount}</span>
    </div>
  );
};

const Recommendations = ({ urlPostId }: Props) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className='loading_message'>로딩 중...</div>}>
        <RecommendationContent urlPostId={urlPostId} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Recommendations;