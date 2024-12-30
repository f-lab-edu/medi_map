import { Router } from 'express';
import authRoutes from '@/routes/auth/index';
import pharmacyRoutes from '@/routes/pharmacy';
import medicineRoutes from '@/routes/medicine';
import mypageRoutes from '@/routes/mypage';
import postRoutes from '@/routes/post';
import healthRoutes from '@/routes/health';
import { ROUTES } from '@/constants/urls';

const router = Router();

router.use(ROUTES.API.AUTH, authRoutes);
router.use(ROUTES.API.PHARMACY, pharmacyRoutes);
router.use(ROUTES.API.MEDICINE, medicineRoutes);
router.use(ROUTES.API.MYPAGE, mypageRoutes);
router.use(ROUTES.API.POST, postRoutes);
router.use(ROUTES.API.HEALTH, healthRoutes);

export default router;
