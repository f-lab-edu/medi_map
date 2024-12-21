import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/app-constants/constants';

const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// 액세스 토큰 생성 함수
export function generateAccessToken(userId: string, email: string): string {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

// 리프레시 토큰 생성 함수
export function generateRefreshToken(userId: string, email: string): { refreshToken: string; refreshExpiresAt: Date } {
  const refreshToken = jwt.sign({ id: userId, email }, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

  // 7일 후의 만료 날짜 계산
  const refreshExpiresAt = new Date();
  refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

  return { refreshToken, refreshExpiresAt };
}
