import { Router } from 'express';
import { signup } from '@/controllers/signupController';
import { login } from '@/controllers/loginController';
import { refresh } from '@/controllers/refreshController';
import { logout } from '@/controllers/logoutController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', (req, res, next) => {
  console.log('[Router Log] /refresh endpoint hit.');
  next();
}, refresh);

router.post('/logout', logout);

export default router;
