'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Comments from '@/components/community/CommentSection';
import Recommendations from '@/components/community/RecommendationSection';

interface Props {
  urlPostId: string;
}

const PostDetailPage = ({ urlPostId }: Props) => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  return (
    <div className='post_bottom_cont'>
      <div className="post_actions">
        <Link className="list_button" href="/community">목록으로</Link>
        <Recommendations urlPostId={urlPostId} />
      </div>

      {currentUserId && <Comments urlPostId={urlPostId} userId={currentUserId} />}
    </div>
  );
};

export default PostDetailPage;