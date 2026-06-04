import type { DefaultSession, DefaultUser } from "next-auth";

type UserRole = "admin" | "buyer" | "seller";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id?: string;
      role?: UserRole;
      status?: string;
      businessName?: string;
    };
  }

  interface User extends DefaultUser {
    id?: string;
    role?: UserRole;
    status?: string;
    businessName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    status?: string;
    businessName?: string;
  }
}
