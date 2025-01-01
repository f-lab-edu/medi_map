import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import os from 'os';
import { PORT } from '@/app-constants/constants';
import { checkEnvVariables } from '@/config/env';
import { winstonLogger } from '@/middleware/winston-logger';
import routes from '@/routes';
import path from 'path';

checkEnvVariables();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

// 정적 파일 제공 설정 추가
const uploadsPath = path.join(__dirname, './uploads/images'); // 상대 경로 수정
app.use('/uploads', express.static(uploadsPath));
console.log(`Static files served from: ${uploadsPath}`);

// 로깅 미들웨어
app.use((req: Request, res: Response, next: NextFunction) => {
  winstonLogger.info(`[Request Log] Method: ${req.method}, URL: ${req.url}`);
  next();
});

app.use(express.json());

// 라우트 설정
app.use(routes);

// 루트 라우트 추가
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express Server!');
});

// 404 처리 라우트
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// 예외 처리 미들웨어
app.use((err: Error, req: Request, res: Response) => {
  winstonLogger.error(`[Error] ${err.stack}`);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

function bootstrap() {
  const hostName = os.hostname();
  const port = PORT || 5000;

  const server = createServer(app);

  server.listen(port, () => {
    winstonLogger.info(`[ ⚡️ ${hostName} ⚡️ ] - Server running on port ${port}`);
    console.log(`Server running on port ${port}`);
  });
}

bootstrap();

export default app;
