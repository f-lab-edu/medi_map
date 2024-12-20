// controllers/logoutAllSessionsController.ts
import { Request, Response } from 'express';
import { removeAllUserRefreshTokens } from '@/services/refreshTokenService';

export const logoutAllSessions = async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  await removeAllUserRefreshTokens(userId);
  return res.status(200).json({ message: 'All sessions logged out' });
};
