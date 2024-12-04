import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@/app-constants/constants';
import { User } from '@/models';

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

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      ...decoded,
      username: user.username,
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token', error: error.message });
  }
};
