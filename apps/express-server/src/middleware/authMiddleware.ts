import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@/app-constants/constants';
import { User } from '@/models';
import { AUTH_MESSAGES } from '@/constants/auth_message';

export interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: CustomJwtPayload & { username?: string };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // 토큰이 없는 경우
  if (!token) {
    console.error('Authentication error: No token provided.');
    return res.status(401).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
  }

  try {
    // 토큰 검증
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    const user = await User.findByPk(decoded.id);

    if (!user) {
      console.error(`Authentication error: User not found for token ID: ${decoded.id}`);
      return res.status(401).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
    }

    // 요청 객체에 유저 정보 추가
    req.user = {
      ...decoded,
      username: user.username,
    };

    next();
  } catch (error) {
    console.error('Authentication error during token verification:', error);
    return res.status(403).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
  }
};
