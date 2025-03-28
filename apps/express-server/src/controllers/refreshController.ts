import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User, sequelize } from '@/models';
import { findRefreshToken, storeRefreshToken, removeRefreshTokens } from '@/services/refreshTokenService';
import { AUTH_MESSAGES } from '@/constants/auth_message';
import { generateAccessToken, generateRefreshToken } from '@/utils/generateToken';

const REFRESH_SECRET = process.env.REFRESH_SECRET;

interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
}

// Refresh token 재발급 컨트롤러
export const refresh = async (req: Request, res: Response): Promise<Response> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
  }

  try {
    // 저장된 토큰인지 확인
    const storedToken = await findRefreshToken(refreshToken);
    if (!storedToken) {
      console.error('Invalid refresh token:', refreshToken);
      return res.status(403).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
    }

    // JWT 디코딩 및 검증
    let decoded: CustomJwtPayload;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET!) as CustomJwtPayload;
    } catch (err) {
      console.error('Expired or invalid refresh token:', err);
      return res.status(403).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
    }

    // 사용자 존재 여부 확인
    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.error('User not found for ID:', decoded.id);
      return res.status(404).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
    }

    // 새로운 토큰 생성
    const newAccessToken = generateAccessToken(user.id, user.email);
    const { refreshToken: newRefreshToken, refreshExpiresAt } = generateRefreshToken(
      user.id,
      user.email
    );

    // 트랜잭션 처리 (삭제 + 저장 동시)
    await sequelize.transaction(async t => {
      await removeRefreshTokens(user.id, t);
      await storeRefreshToken(user.id, newRefreshToken, refreshExpiresAt, t);
    });

    // 응답 반환
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Server error during refresh token processing:', error);
    return res.status(500).json({ message: AUTH_MESSAGES.SERVER_ERROR });
  }
};
