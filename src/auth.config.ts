import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./lib/db";
import User from "./models/UserModel";
import bcrypt from "bcryptjs";
import { authDebug, getAuthSecret } from "./lib/auth-secret";

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

export const authOptions: NextAuthOptions = {
  secret: getAuthSecret(),
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

        if (!user) {
          authDebug("credentials user not found", { email });
          return null;
        }

        const match = await bcrypt.compare(credentials.password, user.password);
        if (!match) {
          authDebug("credentials password mismatch", { email });
          return null;
        }

        const role = user.role || "buyer";
        authDebug("credentials authorized", { email: user.email, role });

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role,
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
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.status = user.status;
        token.businessName = user.businessName;
        authDebug("jwt populated from user", {
          email: user.email,
          role: user.role,
        });
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email || session.user.email;
        session.user.name = token.name || session.user.name;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.businessName = token.businessName;
        authDebug("session populated from token", {
          email: session.user.email,
          role: session.user.role,
        });
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

export default authOptions;
