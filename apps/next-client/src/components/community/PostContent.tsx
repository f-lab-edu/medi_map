'use client';

import createDOMPurify from 'isomorphic-dompurify';
import { Post } from '@/types/post';
import PostActions from '@/components/community/PostActions';

interface PostContentProps {
  post: Post;
}

const PostContent = ({ post }: PostContentProps) => {
  const DOMPurify = createDOMPurify();
  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <div className='post_top_cont'>
      <h2 className="post_title">{post.title}</h2>
      <div className="user_info">
        <span className="post_date">
          {new Date(post.createdAt).toLocaleString('ko-KR')}
        </span>
        <span>{post.author}</span>
      </div>

      <PostActions postId={post.id} userId={post.userId} />

      <div className="post_desc" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  );
};

export default PostContent;