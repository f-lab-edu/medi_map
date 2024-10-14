import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '@/services/authService';
import { generateToken } from '@/utils/generateToken';
import { ERROR_MESSAGES } from '@/constants/errors';

export const signup = async (req: Request, res: Response): Promise<Response> => {
  const { username, email, password } = req.body;

  try {
    // 사용자 이메일로 검색
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const newUser = await createUser(username, email, hashedPassword);

    // 토큰 생성
    const token = generateToken(newUser.id, newUser.email);

    return res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      message: ERROR_MESSAGES.SIGN_UP_ERROR,
      error: (error as Error).message
    });
  }
};
