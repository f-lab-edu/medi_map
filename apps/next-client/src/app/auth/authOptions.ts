import axios from 'axios';
import { ROUTES, API_URLS } from '@/constants/urls';
import { NextAuthOptions, Session, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { checkEnvVariables } from '@/config/env';
import { CredError } from '@/error/CredError';
import { UserDTO } from '@/dto/UserDTO';  
import { ERROR_MESSAGES } from '@/constants/errors';
import { handleError } from '@/util/handleError';

declare module "next-auth" {
  interface Session {
    user: NextAuthUser;  
  }
}

checkEnvVariables();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> { 
        if (!credentials || !credentials.email || !credentials.password) {
          throw new CredError(ERROR_MESSAGES.INVALID_CREDENTIAL);
        }

        try {
          const { data: user } = await axios.post<UserDTO>(API_URLS.LOGIN, {
            email: credentials.email,
            password: credentials.password,
          });
        
          if (!user) {
            throw new CredError(ERROR_MESSAGES.LOGIN_FAILED);
          }
        
          return {
            id: user.id.toString(),
            email: user.email,
          }
        } catch (error) {
          handleError(error); 
          return null;
        }
        
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: Partial<NextAuthUser>, user?: NextAuthUser }) {
      if (user) {
        token.id = user.id.toString();
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }: { session: Session, token: Partial<NextAuthUser> }) {
      if (token.id && token.email) {
        session.user.id = token.id;
        session.user.email = token.email;
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
