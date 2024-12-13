import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '@/services/authService';
import { generateToken } from '@/utils/generateToken';
import { ERROR_MESSAGES } from '@/constants/errors';

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    // 사용자 이메일로 검색
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: ERROR_MESSAGES.AUTH.EMAIL_OR_PASSWORD_INCORRECT });
    }

    // 비밀번호 일치 여부 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: ERROR_MESSAGES.AUTH.EMAIL_OR_PASSWORD_INCORRECT });
    }

    // JWT 토큰 생성
    const token = generateToken(user.id, user.email);
    return res.status(200).json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: ERROR_MESSAGES.AUTH.SERVER_ERROR });
  }
};
