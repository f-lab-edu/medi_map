import { RefreshToken } from '@/models';

// 비동기 처리가 필요하지 않으므로 async 제거
export function storeRefreshToken(userId: string, token: string, expiresAt: Date) {
  return RefreshToken.create({ userId, token, expiresAt });
}

// 비동기 처리가 필요하지 않으므로 async 제거
export function findRefreshToken(token: string) {
  return RefreshToken.findOne({ where: { token } });
}

// 비동기 처리가 필요하지 않으므로 async 제거
export function removeRefreshToken(token: string) {
  return RefreshToken.destroy({ where: { token } });
}

// 비동기 처리가 필요하지 않으므로 async 제거
export function removeAllUserRefreshTokens(userId: string) {
  return RefreshToken.destroy({ where: { userId } });
}
