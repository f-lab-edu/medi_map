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
 * [Auth 설계 핵심 요약]
 * - next-auth는 OAuth 인증 흐름과 세션 처리를 위한 wrapper 역할
 * - 실제 accessToken, refreshToken은 백엔드(express)에서 발급하고 관리
 * - 백엔드 API 호출로 인증/토큰 발급 → next-auth는 그 결과만 전달받아 세션에 저장
 *
 * 설계 이유:
 * - 백엔드가 토큰 발급 책임자라는 구조를 유지하기 위함 (권한 관리, 만료 처리 등 중앙화)
 * - next-auth는 UI 레벨 인증 처리와 OAuth redirect만 담당
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
       * Credentials 로그인 처리
       * -> next-auth는 자체적으로 인증/토큰 발급 안 함
       * -> 백엔드로 API 호출해서 access/refresh token 받아옴
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
     * Google 로그인 콜백
     * -> next-auth에서 인증 후, 백엔드로 다시 유저 등록 요청
     * -> 백엔드에서 accessToken, refreshToken 발급받아 account에 수동 주입
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
     * JWT 콜백
     * -> 로그인 시 또는 토큰 갱신 시 호출
     * -> 토큰 만료되면 refresh 처리도 수행
     */
    async jwt({ token, user, account }) {
      if (account) {
        token.provider = account.provider;
      }

      // credentials 로그인 시
      if (user && account?.provider === 'credentials') {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_EXPIRES_IN;
      }

      // google 로그인 시
      if (account?.provider === 'google') {
        if (account.access_token) {
          token.accessToken = account.access_token;
          token.accessTokenExpires = Date.now() + ACCESS_TOKEN_EXPIRES_IN;
        }
        if (account.refresh_token) {
          token.refreshToken = account.refresh_token;
        }
      }

      // accessToken 만료 시 refresh
      if (token.refreshToken && token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        const refreshedToken = await refreshAccessToken(token as JWT);
        return refreshedToken;
      }

      return token;
    },

    /**
     * Session 콜백
     * -> client로 전달될 session.user 구조 정의
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

  // next-auth는 세션을 JWT 방식으로 저장
  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
};