import axios from "axios";
import { ROUTES, API_URLS } from '@/constants/urls';
import { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"; 
import Credentials from "next-auth/providers/credentials";
import { CredError } from '@/error/CredError';
import { ERROR_MESSAGES } from '@/constants/errors';
import { LoginRequestDto } from '@/dto/LoginRequestDto';
import { LoginResponseDto } from '@/dto/LoginResponseDto';

declare module "next-auth" {
  interface Session {
    user: User; 
  }

  interface User {
    id: number;
    email: string;
    accessToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
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
          const response = await axios.post(API_URLS.LOGIN, loginData);
          const user: LoginResponseDto = response.data;

          if (response.status === 200 && user) {
            return { ...user, accessToken: user.accessToken};
          } else {
            throw new Error(ERROR_MESSAGES.LOGIN_FAILED);
          }
        } catch (error: unknown) {
          throw new Error(ERROR_MESSAGES.LOGIN_FAILED);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; 
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: ROUTES.AUTH.SIGN_IN,
  },
};
