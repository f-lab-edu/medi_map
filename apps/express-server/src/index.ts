import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from '@/routes/auth';
import pharmacyRoutes from '@/routes/parmacy/index';
import { PORT } from '@/app-constants/constants';
import { checkEnvVariables } from '@/config/env';
import { ROUTES } from '@/constants/urls';

checkEnvVariables();

const app = express();

// CORS 설정
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

// 로깅 미들웨어
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Request Origin:', req.headers.origin);
  next();
});

// 미들웨어 설정
app.use(express.json());

// 라우트 설정
app.use(ROUTES.API.AUTH, authRoutes);
app.use(ROUTES.API.PHARMACY, pharmacyRoutes);

// 루트 라우트 추가
app.get(ROUTES.HOME, (req: Request, res: Response) => {
  res.send('Welcome to the Express Server!');
});

// 404 처리 라우트
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// 예외 처리 미들웨어
app.use((err: Error, req: Request, res: Response) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
