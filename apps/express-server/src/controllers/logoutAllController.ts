
import { Request, Response } from 'express';
import { removeRefreshTokens } from '@/services/refreshTokenService';
import { AUTH_MESSAGES } from '@/constants/auth_message';

export const logoutAllSessions = async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.id;

  // 인증되지 않은 경우
  if (!userId) {
    console.error('Logout all sessions error: User not authenticated.');
    return res.status(401).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
  }

  try {
    // 모든 리프레시 토큰 삭제
    await removeRefreshTokens(userId);
    return res.status(200).json({ message: AUTH_MESSAGES.LOGGED_OUT });
  } catch (error) {
    console.error('Logout all sessions error:', error);
    return res.status(500).json({ message: AUTH_MESSAGES.SERVER_ERROR });
  }
};
