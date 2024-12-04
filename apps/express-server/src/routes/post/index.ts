import express from 'express';
import { Post, Comment, Recommendation } from '@/models';
import { authMiddleware, AuthenticatedRequest } from '@/middleware/authMiddleware';
import { MESSAGES_POST } from '@/constants/post_messages';

const router = express.Router();
// 게시글 생성
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: MESSAGES_POST.TITLE_CONTENT_REQUIRED });
    }

    const userId = req.user?.id;
    const author = req.user?.username;

    if (!userId || !author) {
      return res.status(400).json({ message: MESSAGES_POST.USER_INFO_MISSING });
    }

    const newPost = await Post.create({ title, content, userId, author });

    return res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
});

// 게시글 목록 조회
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json(posts);
  } catch (error) {
    next(new Error(MESSAGES_POST.FETCH_POSTS_ERROR));
  }
});

// 게시글 상세 조회
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

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

    if (post.userId !== req.user?.id) {
      return res.status(403).json({ message: MESSAGES_POST.PERMISSION_DENIED_UPDATE });
    }

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

    const existingRecommendation = await Recommendation.findOne({
      where: { articleId: id, userId },
    });

    if (existingRecommendation) {
      await existingRecommendation.destroy();
      return res.status(200).json({ message: MESSAGES_POST.RECOMMENDATION_CANCELLED, recommended: false });
    }

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

    const recommendationCount = await Recommendation.count({
      where: { articleId: id },
    });

    return res.status(200).json({ postId: id, recommendationCount });
  } catch (error) {
    next(error);
  }
});

// 댓글 추가
router.post('/:id/comments', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    const newComment = await Comment.create({ articleId: id, userId, content });
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

// 댓글 조회
router.get('/:id/comments', async (req, res, next) => {
  try {
    const { id } = req.params;

    const comments = await Comment.findAll({
      where: { articleId: id },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

// 댓글 삭제
router.delete('/comments/:commentId', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByPk(commentId);

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
