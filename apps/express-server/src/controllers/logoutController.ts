import { Request, Response } from 'express';
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

    return res.status(200).json({ message: AUTH_MESSAGES.LOGGED_OUT_SUCCESSFULLY });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: AUTH_MESSAGES.SERVER_ERROR });
  }
};

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
    console.warn('Refresh token logic has been removed. Logout all sessions now only clears user state.');

    return res.status(200).json({ message: AUTH_MESSAGES.LOGGED_OUT });
  } catch (error) {
    console.error('Logout all sessions error:', error);
    return res.status(500).json({ message: AUTH_MESSAGES.SERVER_ERROR });
  }
};
