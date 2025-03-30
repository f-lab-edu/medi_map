import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// 액세스 토큰 생성 함수
export function generateAccessToken(userId: string, email: string): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign({ id: userId, email }, jwtSecret, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

// 리프레시 토큰 생성 함수
export function generateRefreshToken(
  userId: string,
  email: string
): { refreshToken: string; refreshExpiresAt: Date } {
  const refreshSecret = process.env.REFRESH_SECRET;
  if (!refreshSecret) {
    throw new Error('REFRESH_SECRET is not defined');
  }

  // 리프레시 토큰 생성
  const refreshToken = jwt.sign({ id: userId, email }, refreshSecret, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  const refreshExpiresAt = new Date();
  refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

  return { refreshToken, refreshExpiresAt };
}
