import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { axiosInstance } from '@/services/axiosInstance';
import { ERROR_MESSAGES } from '@/constants/errors';
import { API_URLS } from '@/constants/urls';
import { CredError } from '@/error/CredError';
import { refreshAccessToken } from '@/utils/authUtils';

const ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 1000;

/**
 * next-auth 설정 객체
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      /**
       * credentials 로그인 로직
       * 사용자 이메일/비번 검증 후 커스텀 토큰과 유저 정보 반환
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new CredError(ERROR_MESSAGES.INVALID_CREDENTIAL);
        }

        try {
          const { data, status } = await axiosInstance.post(API_URLS.LOGIN, {
            email: credentials.email,
            password: credentials.password,
          });

          const { token, refreshToken, user } = data;
          if (status === 200 && user && token && refreshToken) {
            return {
              id: user.id,
              email: user.email,
              accessToken: token,
              refreshToken,
              provider: 'credentials',
            };
          }

          throw new CredError(ERROR_MESSAGES.LOGIN_FAILED);
        } catch (error) {
          console.error('Login failed:', error);
          throw new CredError(ERROR_MESSAGES.LOGIN_FAILED);
        }
      },
    }),
  ],

  callbacks: {
    /**
     * signIn 콜백
     * 구글 로그인 시 백엔드에 유저 생성/검증 요청
     * accessToken, refreshToken을 next-auth 내부에 전달
     */
    async signIn({ account, profile }) {
      if (account?.provider === 'google' && profile) {
        try {
          const response = await axiosInstance.post(API_URLS.GOOGLE_LOGIN, {
            googleId: profile.sub,
            email: profile.email,
            username: profile.name,
          });

          if (response.data.accessToken && response.data.refreshToken) {
            account.access_token = response.data.accessToken;
            account.refresh_token = response.data.refreshToken;
            account.provider = 'google';
          }

          return true;
        } catch (error) {
          console.error('Google login failed:', error);
          return false;
        }
      }

      return true;
    },

    /**
     * jwt 콜백
     * JWT 토큰 내부에 저장될 값들을 정의
     * 로그인 시 또는 토큰 갱신 시 호출됨
     */
    async jwt({ token, user, account }) {
      if (account) {
        token.provider = account.provider;
      }

      // credentials 로그인
      if (user && account?.provider === 'credentials') {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_EXPIRES_IN;
      }

      // google 로그인
      if (account?.provider === 'google') {
        if (account.access_token) {
          token.accessToken = account.access_token;
          token.accessTokenExpires = Date.now() + ACCESS_TOKEN_EXPIRES_IN;
        }
        if (account.refresh_token) {
          token.refreshToken = account.refresh_token;
        }
      }

      // accessToken 만료됐으면 refresh 처리
      if (token.refreshToken && token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        const refreshedToken = await refreshAccessToken(token as JWT);
        return refreshedToken;
      }

      return token;
    },

    /**
     * session 콜백
     * 클라이언트로 전달되는 session.user 구조 정의
     */
    async session({ session, token }) {
      session.user = {
        id: token.id || '',
        email: token.email as string,
        provider: token.provider || '',
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string || '',
        googleAccessToken: token.googleAccessToken || '',
      };

      return session;
    },
  },

  // JWT 기반 세션 사용
  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
};