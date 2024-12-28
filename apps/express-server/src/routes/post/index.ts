import express from 'express';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { Post, Comment, Recommendation, User } from '@/models';
import { authMiddleware, AuthenticatedRequest } from '@/middleware/authMiddleware';
import { MESSAGES_POST } from '@/constants/post_messages';

const router = express.Router();

const window = new JSDOM('').window;
const DOMPurifyInstance = DOMPurify(window);

function sanitizeHTML(html: string) {
  return DOMPurifyInstance.sanitize(html);
}

// 게시글 생성
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    let { title, content } = req.body;

    // 제목과 내용이 없으면 에러 반환
    if (!title || !content) {
      return res.status(400).json({ message: MESSAGES_POST.TITLE_CONTENT_REQUIRED });
    }

    const userId = req.user?.id;
    const author = req.user?.username;

    // 사용자 정보가 없으면 에러 반환
    if (!userId || !author) {
      return res.status(400).json({ message: MESSAGES_POST.USER_INFO_MISSING });
    }

    // HTML 데이터 정화
    title = sanitizeHTML(title);
    content = sanitizeHTML(content);

    // 게시글 생성
    const newPost = await Post.create({ title, content, userId, author });
    return res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    next(error);
  }
});


// 게시글 목록 조회
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(String(req.query.page), 10) || 1;
    const limit = parseInt(String(req.query.limit), 10) || 10;
    const offset = (page - 1) * limit;

    // 게시글 데이터 가져오기
    const { count, rows: posts } = await Post.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    // 총 페이지 수 계산
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({ totalItems: count, totalPages, currentPage: page, posts });
  } catch (error) {
    next(new Error(MESSAGES_POST.FETCH_POSTS_ERROR));
  }
});


// 게시글 상세 조회
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    // 게시글 상세 정보와 댓글, 추천 포함 반환
    const post = await Post.findOne({
      where: { id },
      include: [
        { model: Comment, attributes: ['id', 'content'], as: 'comments' },
        { model: Recommendation, attributes: ['recommendedTime'], as: 'recommendations' },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: MESSAGES_POST.POST_NOT_FOUND });
    }

    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

// 게시글 수정
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: MESSAGES_POST.POST_NOT_FOUND });
    }

    // 현재 사용자만 수정 가능
    if (post.userId !== req.user?.id) {
      return res.status(403).json({ message: MESSAGES_POST.PERMISSION_DENIED_UPDATE });
    }

    // 제목과 내용 업데이트
    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

// 게시글 삭제
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: MESSAGES_POST.POST_NOT_FOUND });
    }

    // 현재 사용자만 삭제 가능
    if (post.userId !== req.user?.id) {
      return res.status(403).json({ message: MESSAGES_POST.PERMISSION_DENIED_DELETE });
    }

    await post.destroy();
    return res.status(200).json({ message: MESSAGES_POST.POST_DELETE_COMPLETE });
  } catch (error) {
    next(error);
  }
});

// 게시글 추천 추가/취소
router.post('/:id/recommend', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // 이미 추천했으면 추천 취소
    const existingRecommend = await Recommendation.findOne({
      where: { articleId: id, userId },
    });

    if (existingRecommend) {
      await existingRecommend.destroy();
      return res.status(200).json({ message: MESSAGES_POST.RECOMMENDATION_CANCELLED, recommended: false });
    }

    // 추천 추가
    await Recommendation.create({ articleId: id, userId });
    return res.status(200).json({ message: MESSAGES_POST.RECOMMENDED, recommended: true });
  } catch (error) {
    next(error);
  }
});

// 게시글 추천 수 조회
router.get('/:id/recommend', async (req, res, next) => {
  try {
    const { id } = req.params;

    // 추천 수 반환
    const recommendationCount = await Recommendation.count({
      where: { articleId: id },
    });

    return res.status(200).json({ postId: id, recommendationCount });
  } catch (error) {
    next(error);
  }
});

// 댓글 추가
router.post('/:id/comments', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    const user = await User.findByPk(userId, { attributes: ['username'] });
    console.log('user: ', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 댓글 생성
    const newComment = await Comment.create({
      articleId: id,
      userId,
      author: user.username,
      content,
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    next(error);
  }
});

// 댓글 조회
router.get('/:id/comments', async (req, res, next) => {
  try {
    const { id } = req.params;

    // 게시글의 댓글 최신순으로 반환
    const comments = await Comment.findAll({
      where: { articleId: id },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

// 댓글 수정
router.put('/comments/:commentId', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: MESSAGES_POST.COMMENT_CONTENT_REQUIRED });
    }

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: MESSAGES_POST.COMMENT_NOT_FOUND });
    }

    // 댓글 작성자만 수정 가능
    if (comment.userId !== req.user?.id) {
      return res.status(403).json({ message: MESSAGES_POST.PERMISSION_DENIED_UPDATE });
    }

    // 댓글 내용 수정
    comment.content = content;
    await comment.save();

    res.status(200).json({ message: MESSAGES_POST.COMMENT_UPDATED, comment });
  } catch (error) {
    next(error);
  }
});


// 댓글 삭제
router.delete('/comments/:commentId', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByPk(commentId);

    // 댓글 작성자만 삭제 가능
    if (!comment || comment.userId !== req.user?.id) {
      return res.status(403).json({ message: MESSAGES_POST.PERMISSION_DENIED_DELETE });
    }

    await comment.destroy();
    res.status(200).json({ message: MESSAGES_POST.COMMENT_DELETED });
  } catch (error) {
    next(error);
  }
});

export default router;
