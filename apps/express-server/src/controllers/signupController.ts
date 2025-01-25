import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '@/services/authService';
import { generateAccessToken, generateRefreshToken } from '@/utils/generateToken';
import { AUTH_MESSAGES } from '@/constants/auth_message';
import { storeRefreshToken } from '@/services/refreshTokenService';
import { validateUser } from '@medi-map/validation';

// 회원가입 처리
export const signup = async (req: Request, res: Response): Promise<Response> => {
  const { username, email, password } = req.body;

  try {
    // 유효성 검사
    const validationResult = validateUser(req.body);

    if (!validationResult.success) {
      const flattenedErrors = validationResult.error.flatten().fieldErrors;

      console.error('Validation error:', flattenedErrors);

      const [firstField, firstMessages] = Object.entries(flattenedErrors)[0];

      return res.status(400).json({
        message: firstMessages[0],
        field: firstField
      });
    }

    // 이메일 중복 확인
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.error('Signup error: Email already exists:', email);
      return res.status(400).json({ message: AUTH_MESSAGES.EMAIL_ALREADY_EXISTS });
    }

    // 비밀번호 암호화 및 사용자 생성
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(username, email, hashedPassword);

    // 토큰 생성
    const accessToken = generateAccessToken(newUser.id, newUser.email);
    const { refreshToken, refreshExpiresAt } = generateRefreshToken(newUser.id, newUser.email);

    // 리프레시 토큰 저장
    await storeRefreshToken(newUser.id, refreshToken, refreshExpiresAt);

    return res.status(201).json({ token: accessToken, refreshToken, user: newUser });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: AUTH_MESSAGES.SIGN_UP_ERROR });
  }
};
