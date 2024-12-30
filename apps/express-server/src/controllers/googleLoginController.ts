import { Request, Response } from 'express';
import { User } from '@/models';
import { generateAccessToken, generateRefreshToken } from '@/utils/generateToken';

export const googleLogin = async (req: Request, res: Response) => {
  const { googleId, email, username } = req.body;

  if (!googleId || !email) {
    console.error('Missing Google ID or email:', { googleId, email });
    return res.status(400).json({ message: 'Missing Google ID or email' });
  }

  try {
    let user = await User.findOne({ where: { googleId } });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        username,
        password: null,
        provider: 'google',
      });
    }

    const accessToken = generateAccessToken(user.id, user.email);
    const { refreshToken, refreshExpiresAt } = generateRefreshToken(user.id, user.email);

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
