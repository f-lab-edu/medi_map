import { Request, Response } from 'express';
import { removeRefreshTokens } from '@/services/refreshTokenService';
import { User } from '@/models';
import { AUTH_MESSAGES } from '@/constants/auth_message';

export const logout = async (req: Request, res: Response): Promise<Response> => {
  const { userId, googleId } = req.body;

  if (!userId && !googleId) {
    console.error('Logout error: userId or googleId is missing.');
    return res.status(400).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
  }

  try {
    let user;

    // 일반 사용자
    if (userId) {
      user = await User.findOne({ where: { id: userId } });
    }
    // Google 사용자
    else if (googleId) {
      user = await User.findOne({ where: { googleId } });
    }

    if (!user) {
      console.error('Logout error: User not found.');
      return res.status(404).json({ message: AUTH_MESSAGES.USER_NOT_FOUND });
    }

    await removeRefreshTokens(user.id);

    res.clearCookie('refreshToken');

    return res.status(200).json({ message: AUTH_MESSAGES.LOGGED_OUT_SUCCESSFULLY });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: AUTH_MESSAGES.SERVER_ERROR });
  }
};
