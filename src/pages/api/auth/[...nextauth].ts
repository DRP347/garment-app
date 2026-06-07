import NextAuth from "next-auth";
import { authOptions } from "@/auth.config";

export { authOptions };
export default NextAuth(authOptions);
