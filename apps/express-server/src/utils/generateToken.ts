import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/app-constants/constants';

// JWT 토큰 생성 함수
export const generateToken = (id: number, email: string): string => {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '1h' });
};
