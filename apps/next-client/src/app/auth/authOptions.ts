import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { ROUTES, API_URLS } from '@/constants/urls';
import { CredError } from '@/error/CredError';
import { LoginRequestDto } from '@/dto/LoginRequestDto';
import { LoginResponseDto } from '@/dto/LoginResponseDto';
import { ERROR_MESSAGES } from '@/constants/errors';
import { axiosInstance } from '@/services/axiosInstance';

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
          const response = await axiosInstance.post('', loginData); 
          const user: LoginResponseDto = response.data;

          if (response.status === 200 && user) {
            return { id: user.email, email: user.email, accessToken: user.token };
          } else {
            throw new CredError(ERROR_MESSAGES.LOGIN_FAILED); 
          }
        } catch {
          throw new CredError(ERROR_MESSAGES.LOGIN_FAILED); 
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
        session.user.accessToken = token.accessToken;
      }
      return session;
    }    
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
};