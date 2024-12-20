// controllers/logoutController.ts
import { Request, Response } from 'express';
import { removeRefreshToken } from '@/services/refreshTokenService';

export const logout = async (req: Request, res: Response): Promise<Response> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  // Refresh Token 삭제
  await removeRefreshToken(refreshToken);

  // 클라이언트 쿠키에 Refresh Token이 있었다면 쿠키 제거 명령(옵션)
  res.clearCookie('refreshToken');

  return res.status(200).json({ message: 'Logged out successfully' });
};
