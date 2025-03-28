import { RefreshToken } from '@/models';
import { Transaction } from 'sequelize';

// 리프레시 토큰 저장
export function storeRefreshToken(
  userId: string,
  token: string,
  expiresAt: Date,
  transaction?: Transaction
) {
  return RefreshToken.create(
    { userId, token, expiresAt },
    transaction ? { transaction } : undefined
  );
}

// 리프레시 토큰 삭제
export function removeRefreshTokens(userId: string, transaction?: Transaction) {
  return RefreshToken.destroy({
    where: { userId },
    ...(transaction && { transaction }),
  });
}

// 리프레시 토큰 조회
export function findRefreshToken(token: string) {
  return RefreshToken.findOne({ where: { token } });
}
