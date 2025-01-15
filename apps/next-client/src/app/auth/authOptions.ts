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

    async jwt({ token, user, account }) {
      if (account) {
        token.provider = account.provider;
      }

      if (user && account?.provider === 'credentials') {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_EXPIRES_IN;
      }

      if (account?.provider === 'google') {
        if (account.access_token) {
          token.accessToken = account.access_token;
          token.accessTokenExpires = Date.now() + ACCESS_TOKEN_EXPIRES_IN;
        }
        if (account.refresh_token) {
          token.refreshToken = account.refresh_token;
        }
      }

      if (token.refreshToken && token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        const refreshedToken = await refreshAccessToken(token as JWT);
        return refreshedToken;
      }

      return token;
    },

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

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
};