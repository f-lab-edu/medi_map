import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { axiosInstance } from '@/services/axiosInstance';
import { ERROR_MESSAGES } from '@/constants/errors';
import { API_URLS } from '@/constants/urls';
import { CredError } from '@/error/CredError';
import { LoginRequestDto } from '@/dto/LoginRequestDto';
import { LoginResponseDto } from '@/dto/LoginResponseDto';
import { refreshAccessToken } from '@/utils/authUtils';

const ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 1000;

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
        if (!credentials?.email || !credentials.password) {
          throw new CredError(ERROR_MESSAGES.INVALID_CREDENTIAL);
        }

        const loginData: LoginRequestDto = {
          email: credentials.email,
          password: credentials.password,
        };

        try {
          const { data, status } = await axiosInstance.post(API_URLS.LOGIN, loginData);
          const { token, refreshToken, user: userData } = data as LoginResponseDto;

          if (status === 200 && userData && token && refreshToken) {
            return {
              id: userData.id,
              email: userData.email,
              accessToken: token,
              refreshToken: refreshToken,
            };
          }

          throw new CredError(ERROR_MESSAGES.LOGIN_FAILED);
        } catch (error) {
          throw new CredError(ERROR_MESSAGES.LOGIN_FAILED);
        }
      },
    }),
  ],

  callbacks: {
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

      if (Date.now() > token.accessTokenExpires) {
        return refreshAccessToken(token as JWT);
      }

      return token;
    },

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