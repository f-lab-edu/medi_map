import { Router } from 'express';
import { signup, login } from '../../controllers/authController';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.post('/signup', signup);

router.post('/login', login);

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

export default router;
