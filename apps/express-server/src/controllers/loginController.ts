// controllers/loginController.ts (Refresh Token 발급 시 쿠키로 전달 가능)
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '@/services/authService';
import { generateAccessToken, generateRefreshToken } from '@/utils/generateToken';
import { ERROR_MESSAGES } from '@/constants/errors';
import { storeRefreshToken } from '@/services/refreshTokenService';

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: ERROR_MESSAGES.AUTH.EMAIL_OR_PASSWORD_INCORRECT });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: ERROR_MESSAGES.AUTH.EMAIL_OR_PASSWORD_INCORRECT });
    }

    const accessToken = generateAccessToken(user.id, user.email);
    const { refreshToken, refreshExpiresAt } = generateRefreshToken(user.id, user.email);

    await storeRefreshToken(user.id, refreshToken, refreshExpiresAt);

    // 여기서 쿠키로 Refresh Token 제공 가능 (옵션)
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    // });

    return res.status(200).json({
      token: accessToken,
      refreshToken,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: ERROR_MESSAGES.AUTH.SERVER_ERROR });
  }
};
