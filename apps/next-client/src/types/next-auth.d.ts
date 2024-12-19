import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    email: string;
    accessToken: string;
  }

  interface Session extends DefaultSession {
    user: User;
  }

  interface Session {
    user: {
      email: string;
      accessToken: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    email: string;
    accessToken: string;
  }
}
