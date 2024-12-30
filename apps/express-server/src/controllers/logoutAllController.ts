import { Request, Response } from 'express';
import { removeRefreshTokens } from '@/services/refreshTokenService';
import { AUTH_MESSAGES } from '@/constants/auth_message';
import { User } from '@/models';

export const logoutAllSessions = async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.id;

  if (!userId) {
    console.error('Logout all sessions error: User not authenticated.');
    return res.status(401).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
  }

  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    console.error('Logout all sessions error: User not found.');
    return res.status(404).json({ message: AUTH_MESSAGES.USER_NOT_FOUND });
  }

  try {
    await removeRefreshTokens(userId);

    return res.status(200).json({ message: AUTH_MESSAGES.LOGGED_OUT });
  } catch (error) {
    console.error('Logout all sessions error:', error);
    return res.status(500).json({ message: AUTH_MESSAGES.SERVER_ERROR });
  }
};
