import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./lib/db";
import User from "./models/UserModel";
import bcrypt from "bcryptjs";

type UserRole = "admin" | "buyer" | "seller";
type AuthUserRecord = {
  _id: { toString: () => string };
  email: string;
  name: string;
  password: string;
  role?: UserRole;
  status?: string;
  businessName?: string;
};

const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const email = String(credentials.email || "").trim().toLowerCase();
        if (!email) return null;

        await connectDB();
        const user = (await User.findOne({
          email,
        }).lean()) as AuthUserRecord | null;

        if (!user) return null;

        const match = await bcrypt.compare(credentials.password, user.password);
        if (!match) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "buyer",
          status: user.status,
          businessName: user.businessName,
        };
      },
    }),
  ],

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

  pages: {
    signIn: "/login",
  },
};

export default authOptions;
