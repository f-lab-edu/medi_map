import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { API_URLS } from '@/constants/urls';
import { CredError } from '@/error/CredError';
import { LoginRequestDto } from '@/dto/LoginRequestDto';
import { LoginResponseDto } from '@/dto/LoginResponseDto';
import { ERROR_MESSAGES } from '@/constants/errors';
import { axiosInstance } from '@/services/axiosInstance';
import { JWT } from 'next-auth/jwt';

const ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 1000;

// 액세스 토큰 갱신
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await axiosInstance.post(API_URLS.REFRESH, {
      refreshToken: token.refreshToken,
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

    // 갱신된 토큰 반환
    return {
      ...token,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRES_IN,
    };
  } catch (error) {
    console.error('RefreshAccessToken - Error:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

// NextAuth 설정
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
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new CredError(ERROR_MESSAGES.INVALID_CREDENTIAL);
        }
        const loginData: LoginRequestDto = {
          email: credentials.email,
          password: credentials.password,
        };

        try {
          const response = await axiosInstance.post(API_URLS.LOGIN, loginData);
          const { token, refreshToken, user: userData } = response.data as LoginResponseDto;

          // 로그인 성공 시 사용자 정보 반환
          if (response.status === 200 && userData && token && refreshToken) {
            return {
              id: userData.id,
              email: userData.email,
              accessToken: token,
              refreshToken: refreshToken,
            };
          } else {
            throw new CredError(ERROR_MESSAGES.LOGIN_FAILED);
          }
        } catch (error) {
          throw new CredError(ERROR_MESSAGES.LOGIN_FAILED);
        }
      },
    }),
  ],

  callbacks: {
    // JWT 토큰 생성
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRES_IN,
        };
      }

      // 액세스 토큰 만료 시 갱신
      if (Date.now() > token.accessTokenExpires) {
        return refreshAccessToken(token as JWT);
      }

      return token;
    },

    // 세션 생성
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id!;
        session.user.email = token.email!;
        session.user.accessToken = token.accessToken!;
        session.user.refreshToken = token.refreshToken!;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
};