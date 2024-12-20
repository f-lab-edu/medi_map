import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '@/services/authService';
import { generateAccessToken, generateRefreshToken } from '@/utils/generateToken';
import { ERROR_MESSAGES } from '@/constants/errors';
import { storeRefreshToken } from '@/services/refreshTokenService';

export const signup = async (req: Request, res: Response): Promise<Response> => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: ERROR_MESSAGES.AUTH.EMAIL_ALREADY_EXISTS });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(username, email, hashedPassword);

    const accessToken = generateAccessToken(newUser.id, newUser.email);
    const { refreshToken, refreshExpiresAt } = generateRefreshToken(newUser.id, newUser.email);

    await storeRefreshToken(newUser.id, refreshToken, refreshExpiresAt);

    // Refresh Token을 쿠키로 전달 가능 (옵션)
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    // });

    return res.status(201).json({ token: accessToken, refreshToken, user: newUser });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      message: ERROR_MESSAGES.AUTH.SIGN_UP_ERROR,
      error: (error as Error).message,
    });
  }
};
