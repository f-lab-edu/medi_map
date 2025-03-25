import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '@/services/authService';
import { generateAccessToken } from '@/utils/generateToken';
import { AUTH_MESSAGES } from '@/constants/auth_message';

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    // 유저 조회
    const user = await findUserByEmail(email);
    if (!user) {
      console.error('Login error: User not found for email:', email);
      return res.status(400).json({ message: AUTH_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT });
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Login error: Password mismatch for user:', email);
      return res.status(400).json({ message: AUTH_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT });
    }

    // 토큰 생성
    const accessToken = generateAccessToken(user.id, user.email);

    return res.status(200).json({
      token: accessToken,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: AUTH_MESSAGES.SERVER_ERROR });
  }
};
