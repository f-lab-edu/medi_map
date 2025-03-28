import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '@/models';
import {
  findRefreshToken,
  storeRefreshToken,
  removeRefreshTokens,
} from '@/services/refreshTokenService';
import { AUTH_MESSAGES } from '@/constants/auth_message';
import {
  generateAccessToken,
  generateRefreshToken,
} from '@/utils/generateToken';

const REFRESH_SECRET = process.env.REFRESH_SECRET;

interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
}

// 리프레시 토큰 재발급 컨트롤러
export const refresh = async (req: Request, res: Response): Promise<Response> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
  }

  try {
    // 저장된 토큰인지 체크
    const storedToken = await findRefreshToken(refreshToken);
    if (!storedToken) {
      console.error('Invalid refresh token:', refreshToken);
      return res.status(403).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
    }

    let decoded: CustomJwtPayload;
    try {
      // JWT 검증
      decoded = jwt.verify(refreshToken, REFRESH_SECRET) as CustomJwtPayload;
    } catch (err) {
      console.error('Expired or invalid refresh token:', err);
      return res.status(403).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
    }

    // 사용자 확인
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

    // 기존 토큰 전부 삭제 -> 새로 저장
    await removeRefreshTokens(user.id);
    await storeRefreshToken(user.id, newRefreshToken, refreshExpiresAt);

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Server error during refresh token processing:', error);
    return res.status(500).json({ message: AUTH_MESSAGES.SERVER_ERROR });
  }
};
