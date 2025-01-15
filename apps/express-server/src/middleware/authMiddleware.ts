import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import { JWT_SECRET } from '@/app-constants/constants';
import { User } from '@/models';
import { AUTH_MESSAGES } from '@/constants/auth_message';

export interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: CustomJwtPayload & { username?: string };
}

const verifyGoogleToken = async (token: string) => {
  try {
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${token}`
    );
    return response.data;
  } catch (error) {
    console.error('Google Access Token verification failed:', error);
    throw new Error('Invalid Google Access Token');
  }
};

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error('Authentication error: No token provided.');
    return res.status(401).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    const user = await User.findByPk(decoded.id);

    if (!user) {
      console.error(`Authentication error: User not found for token ID: ${decoded.id}`);
      return res.status(401).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
    }

    req.user = {
      ...decoded,
      username: user.username,
    };

    next();
  } catch (jwtError) {
    console.error('JWT verification failed. Attempting Google token verification...');

    try {
      const googleUser = await verifyGoogleToken (token);

      req.user = {
        id: googleUser.sub,
        username: googleUser.name,
        email: googleUser.email,
      };

      next();
    } catch (googleError) {
      console.error('Authentication error during Google token verification:', googleError);
      return res.status(403).json({ message: AUTH_MESSAGES.AUTHENTICATION_ERROR });
    }
  }
};
