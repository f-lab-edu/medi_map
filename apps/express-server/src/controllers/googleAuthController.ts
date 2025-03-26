import { Request, Response } from 'express';
import { google } from 'googleapis';
import { generateAccessToken, generateRefreshToken } from '@/utils/generateToken';
import { User } from '@/models';
import { createUser } from '@/services/authService';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/google/callback`
);

export const googleAuth = async (req: Request, res: Response) => {
  try {
    // Google OAuth URL 생성
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: true,
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
    });

    // Google 로그인 페이지로 리다이렉트
    res.redirect(authUrl);
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: 'Authorization code is missing' });
    }

    // 인증 코드로 토큰 교환
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    // Google API로 사용자 정보 가져오기
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    const { email, name } = data;

    // 사용자 찾기 또는 생성
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await createUser(name, email, null);
    }

    // JWT 토큰 생성
    const accessToken = generateAccessToken(user.id, user.email);
    const { refreshToken } = generateRefreshToken(user.id, user.email);

    // 프론트엔드로 리다이렉트 (토큰 포함)
    res.redirect(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).json({ message: 'Google callback failed' });
  }
};
