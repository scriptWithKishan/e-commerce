import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string,
      sellerStatus: string,
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string,
    sellerStatus: string,
  }
}
