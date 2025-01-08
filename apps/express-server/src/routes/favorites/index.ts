import { Router } from 'express';
import { addFavorite, getFavorites } from '@/controllers/favoritesController';
import { authMiddleware } from '@/middleware/authMiddleware';

const router = Router();

// 즐겨찾기 추가
router.post('/', authMiddleware, addFavorite);

// 즐겨찾기 조회
router.get('/', authMiddleware, getFavorites);

export default router;
