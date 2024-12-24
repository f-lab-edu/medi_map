import { Request, Response } from 'express';
import { removeRefreshTokens } from '@/services/refreshTokenService';
import { AUTH_MESSAGES } from '@/constants/auth_message';
import { User } from '@/models'; // User 모델

export const logoutAllSessions = async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.id;

  if (!userId) {
    console.error('Logout all sessions error: User not authenticated.');
    return res.status(401).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
  }

  // 1) DB에서 이 유저가 실제 존재하는지 확인 (소셜 유저든 일반 유저든)
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    console.error('Logout all sessions error: User not found.');
    return res.status(404).json({ message: AUTH_MESSAGES.USER_NOT_FOUND });
  }

  // 2) UUID 검증(굳이 필요하다면)
  // if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(userId)) {
  //   console.error('Logout all sessions error: Invalid UUID format.');
  //   return res.status(400).json({ message: 'Invalid user ID format.' });
  // }

  try {
    // 3) Refresh Token이 있을 경우 삭제
    await removeRefreshTokens(userId);

    return res.status(200).json({ message: AUTH_MESSAGES.LOGGED_OUT });
  } catch (error) {
    console.error('Logout all sessions error:', error);
    return res.status(500).json({ message: AUTH_MESSAGES.SERVER_ERROR });
  }
};
