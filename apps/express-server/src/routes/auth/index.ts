import { Router } from 'express';
import { signup } from '@/controllers/signupController';
import { login } from '@/controllers/loginController';
import { refresh } from '@/controllers/refreshController';
import { logout } from '@/controllers/logoutController';
import { googleAuth, googleCallback } from '@/controllers/googleAuthController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Google OAuth 라우트
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

export default router;
