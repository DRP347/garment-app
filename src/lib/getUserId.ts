import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";

export async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}
