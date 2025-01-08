import { Router } from 'express';
import { addFavorite, getFavorites, removeFavorite } from '@/controllers/favoritesController';
import { authMiddleware } from '@/middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, addFavorite);
router.get('/', authMiddleware, getFavorites);
router.delete('/:medicineId', authMiddleware, removeFavorite);

export default router;
