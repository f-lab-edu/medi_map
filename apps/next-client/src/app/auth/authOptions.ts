import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { axiosInstance } from '@/services/axiosInstance';
import { ERROR_MESSAGES } from '@/constants/errors';
import { API_URLS } from '@/constants/urls';
import { CredError } from '@/error/CredError';
import { refreshAccessToken } from '@/utils/authUtils';

const ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 1000; // 1시간 만료

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
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        try {
          await axiosInstance.post(API_URLS.GOOGLE_LOGIN, {
            googleId: profile.sub,
            email: profile.email,
            username: profile.name,
          });
          return true;
        } catch (error) {
          console.error('Google login failed:', error);
          return false;
        }
      }
      return true;
    },      
    async jwt({ token, user, account, profile }) {
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

      // Access Token 갱신 로직 추가
      if (token.refreshToken) {
        if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
          return refreshAccessToken(token as JWT);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string | '',
        googleId: token.googleId as string | '',
      };
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
};
