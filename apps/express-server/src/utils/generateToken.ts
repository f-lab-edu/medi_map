import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/app-constants/constants';

const ACCESS_TOKEN_EXPIRES_IN = '1h';

// 액세스 토큰 생성 함수
export function generateAccessToken(userId: string, email: string): string {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}
