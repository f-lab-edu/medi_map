import { RefreshToken } from '@/models';

// 리프레시 토큰 저장
export function storeRefreshToken(userId: string, token: string, expiresAt: Date) {
  return RefreshToken.create({ userId, token, expiresAt });
}

// 리프레시 토큰 조회
export function findRefreshToken(token: string) {
  return RefreshToken.findOne({ where: { token } });
}

// 리프레시 토큰 삭제
export function removeRefreshToken(token: string) {
  return RefreshToken.destroy({ where: { token } });
}

// 특정 사용자의 모든 리프레시 토큰 삭제
export function removeRefreshTokens(userId: string) {
  return RefreshToken.destroy({ where: { userId } });
}
