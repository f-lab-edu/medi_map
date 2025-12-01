import React, { Suspense } from 'react';
import CommentList from '@/components/community/CommentList';
import CommentForm from '@/components/community/CommentForm';
import { useFetchComments } from '@/hooks/queries/useComments';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

interface Props {
  urlPostId: string;
  userId: string;
}

const CommentsContent = ({ urlPostId, userId }: Props) => {
  const { data: comments = [] } = useFetchComments(urlPostId);

  return (
    <>
      <CommentForm urlPostId={urlPostId} />
      <CommentList comments={comments} userId={userId} urlPostId={urlPostId} />
    </>
  );
};

export default function CommentSection({ urlPostId, userId }: Props) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <CommentsContent urlPostId={urlPostId} userId={userId} />
      </Suspense>
    </ErrorBoundary>
  );
}