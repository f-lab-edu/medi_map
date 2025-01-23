import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '@/models/user';
import { findRefreshToken, storeRefreshToken } from '@/services/refreshTokenService';
import { AUTH_MESSAGES } from '@/constants/auth_message';
import { generateAccessToken, generateRefreshToken } from '@/utils/generateToken';

const REFRESH_SECRET = process.env.REFRESH_SECRET;

interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
}

// 리프레시 토큰 재발급
export const refresh = async (req: Request, res: Response): Promise<Response> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
  }

  // 환경 변수 검증
  if (!REFRESH_SECRET) {
    console.error('Missing REFRESH_SECRET environment variable');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  try {
    // 저장된 리프레시 토큰 확인
    const storedToken = await findRefreshToken(refreshToken);
    if (!storedToken) {
      console.error('Invalid refresh token:', refreshToken);
      return res.status(403).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
    }

    let decoded: CustomJwtPayload;
    try {
      // 타입을 unknown으로 캐스팅 후 명확한 타입 단언
      const decodedToken = jwt.verify(refreshToken, REFRESH_SECRET) as unknown as CustomJwtPayload;

      if (!decodedToken.id || !decodedToken.email) {
        throw new Error('Invalid token payload');
      }

      decoded = decodedToken;
    } catch (err) {
      console.error('Expired or invalid refresh token:', err);
      return res.status(403).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
    }

    // 사용자 조회
    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.error('User not found for ID:', decoded.id);
      return res.status(404).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
    }

    // 새 액세스 토큰 및 리프레시 토큰 생성
    const newAccessToken = generateAccessToken(user.id, user.email);
    const { refreshToken: newRefreshToken, refreshExpiresAt } = generateRefreshToken(user.id, user.email);

    // 새 리프레시 토큰 저장
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
