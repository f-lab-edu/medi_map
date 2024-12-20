import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '@/models';
import { findRefreshToken, storeRefreshToken } from '@/services/refreshTokenService';
import { ERROR_MESSAGES } from '@/constants/errors';
import { generateAccessToken, generateRefreshToken } from '@/utils/generateToken';

const REFRESH_SECRET = process.env.REFRESH_SECRET;

interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
}

export const refresh = async (req: Request, res: Response): Promise<Response> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    console.error('[/refresh] No refresh token provided.');
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const storedToken = await findRefreshToken(refreshToken);

    if (!storedToken) {
      console.error('[/refresh] Invalid refresh token. Not found in DB.');
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    let decoded: CustomJwtPayload;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET) as CustomJwtPayload;
    } catch (err) {
      console.error('[/refresh] Failed to verify refresh token:', err.message);
      return res.status(403).json({ message: 'Expired or invalid refresh token' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.error('[/refresh] User not found for decoded ID:', decoded.id);
      return res.status(404).json({ message: 'User not found' });
    }
    const newAccessToken = generateAccessToken(user.id, user.email);

    const { refreshToken: newRefreshToken, refreshExpiresAt } = generateRefreshToken(user.id, user.email);

    await storeRefreshToken(user.id, newRefreshToken, refreshExpiresAt);

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('[/refresh] Unexpected error occurred:', error);
    return res.status(500).json({ message: ERROR_MESSAGES.AUTH.SERVER_ERROR });
  }
};
