// src/pages/api/auth/[...nextauth].ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/UserModel";

type UserRole = "admin" | "buyer" | "seller";
type AuthUserRecord = {
  _id: { toString: () => string };
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: string;
  businessName?: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;
        const email = String(credentials.email || "").trim().toLowerCase();
        if (!email || !credentials.password) return null;

        await connectDB();

        const user = (await User.findOne({
          email,
        }).lean()) as AuthUserRecord | null;

        if (!user) return null;

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "buyer",
          status: user.status,
          businessName: user.businessName,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.businessName = user.businessName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.businessName = token.businessName;
      }
      return session;
    },
  },
};

// THIS MUST EXIST
export default NextAuth(authOptions);
