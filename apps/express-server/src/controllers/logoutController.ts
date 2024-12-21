import { Request, Response } from 'express';
import { removeRefreshTokens } from '@/services/refreshTokenService';
import { AUTH_MESSAGES } from '@/constants/auth_message';

export const logout = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.body;

  if (!userId) {
    console.error('Logout error: userId is missing.');
    return res.status(400).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
  }

  try {
    await removeRefreshTokens(userId);

    res.clearCookie('refreshToken');

    return res.status(200).json({ message: AUTH_MESSAGES.LOGGED_OUT_SUCCESSFULLY });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: AUTH_MESSAGES.SERVER_ERROR });
  }
};
