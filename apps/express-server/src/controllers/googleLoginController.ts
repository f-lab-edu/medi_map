import { Request, Response } from 'express';
import { User, sequelize } from '@/models';
import { generateAccessToken, generateRefreshToken } from '@/utils/generateToken';
import { storeRefreshToken, removeRefreshTokens } from '@/services/refreshTokenService';

// Google 소셜 로그인 처리
export const googleLogin = async (req: Request, res: Response): Promise<Response> => {
  const { googleId, email, username } = req.body;

  if (!googleId || !email) {
    console.error('Missing Google ID or email:', { googleId, email });
    return res.status(400).json({ message: 'Missing Google ID or email' });
  }

  try {
    // 기존 Google 계정 확인
    let user = await User.findOne({ where: { googleId } });

    // 최초 로그인 시 유저 생성
    if (!user) {
      user = await User.create({
        googleId,
        email,
        username,
        password: null,
        provider: 'google',
      });
    }

    // 토큰 생성
    const accessToken = generateAccessToken(user.id, user.email);
    const { refreshToken, refreshExpiresAt } = generateRefreshToken(user.id, user.email);

    // 기존 refreshToken 삭제 -> 새로 저장
    await sequelize.transaction(async t => {
      await removeRefreshTokens(user.id, t);
      await storeRefreshToken(user.id, refreshToken, refreshExpiresAt, t);
    });

    return res.status(200).json({
      user: {
        id: user.id,
        googleId: user.googleId,
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
