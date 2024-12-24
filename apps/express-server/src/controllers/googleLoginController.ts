import { Request, Response } from 'express';
import { User } from '@/models';
import { generateAccessToken, generateRefreshToken } from '@/utils/generateToken';

export const googleLogin = async (req: Request, res: Response) => {
  const { googleId, email, username } = req.body;

  console.log('Request body received:', req.body);

  if (!googleId || !email) {
    console.error('Missing Google ID or email:', { googleId, email });
    return res.status(400).json({ message: 'Missing Google ID or email' });
  }

  try {
    console.log('Processing Google login for:', email);

    // 1. 기존 사용자 확인 (googleId를 기준으로 확인)
    let user = await User.findOne({ where: { googleId } });

    // 2. 사용자 없으면 새로 생성
    if (!user) {
      console.log('Creating new user in database...');
      user = await User.create({
        googleId, // Google ID 저장
        email,
        username,
        password: null, // 소셜 로그인은 비밀번호 필요 없음
      });
    } else {
      console.log('User already exists in database.');
    }

    // 3. 토큰 생성
    const accessToken = generateAccessToken(user.id, user.email);
    const { refreshToken, refreshExpiresAt } = generateRefreshToken(user.id, user.email);

    return res.status(200).json({
      user: {
        id: user.id, // 내부 UUID
        googleId: user.googleId, // Google ID
        email: user.email,
        username: user.username,
      },
      accessToken,
      refreshToken,
      refreshExpiresAt,
    });
  } catch (error) {
    console.error('Error processing Google login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
