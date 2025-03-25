import { Router } from 'express';
import { signup } from '@/controllers/signupController';
import { login } from '@/controllers/loginController';
import { logout } from '@/controllers/logoutController';
import { googleLogin } from '@/controllers/googleLoginController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/google-login', googleLogin);

export default router;
