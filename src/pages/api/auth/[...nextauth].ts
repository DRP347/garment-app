import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        await connectDB();
        const user = await User.findOne({ email: creds.email }).lean();
        if (!user) throw new Error("Invalid credentials");
        const ok = await bcrypt.compare(creds.password, user.password);
        if (!ok) throw new Error("Invalid credentials");
        return { id: String(user._id), name: user.name, email: user.email, role: user.role || "buyer" } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role || "buyer";
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = token.role;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // keep same-origin only
      if (!url.startsWith(baseUrl)) return baseUrl;
      return url;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
