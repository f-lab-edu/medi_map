import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from '@/routes/auth';
import { PORT } from '@/app-constants/constants';
import { checkEnvVariables } from '@/config/env';
import { ROUTES } from '@/constants/urls';

checkEnvVariables();

const app = express();

// CORS 설정
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// CORS 관련 로그 확인 (요청 Origin을 출력)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Request Origin:', req.headers.origin);
  next();
});

// 미들웨어 설정
app.use(express.json());

// 라우트 설정
app.use(ROUTES.API.AUTH, authRoutes);

// 루트 라우트 추가
app.get(ROUTES.HOME, (req: Request, res: Response) => {
  res.send('Welcome to the Express Server!');
});

// 404 처리 라우트 (모든 정의되지 않은 경로에 대해)
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// 예외 처리 미들웨어 (항상 마지막에 추가)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
