import React, { Suspense } from 'react';
import CommentList from '@/components/community/CommentList';
import CommentForm from '@/components/community/CommentForm';
import { useFetchComments } from '@/hooks/queries/useComments';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Props {
  urlPostId: string;
  userId: string;
}

const Comments = ({ urlPostId, userId }: Props) => {
  const { data: comments = [] } = useFetchComments(urlPostId);

  return (
    <>
      <CommentForm urlPostId={urlPostId} />
      <CommentList comments={comments} userId={userId} urlPostId={urlPostId} />
    </>
  );
};

export default function CommentsWithSuspense({ urlPostId, userId }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Comments urlPostId={urlPostId} userId={userId} />
    </Suspense>
  );
}