import ReactMarkdown from 'react-markdown';
import { Post } from '@/types/post';
import PostActions from '@/components/community/PostActions';

interface PostContentProps {
  post: Post;
}

const PostContent = ({ post }: PostContentProps) => {
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

      <div className="post_desc">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default PostContent;