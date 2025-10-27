import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config"; // you already have this

export async function getUserId(req: Request) {
  // 1) NextAuth session
  try {
    const session = await getServerSession(authOptions as any);
    if (session?.user?.id) return session.user.id as string;
  } catch {}
  // 2) Dev fallback header
  const hdr = req.headers.get("x-user-id");
  if (hdr) return hdr;
  throw new Response("Unauthorized", { status: 401 });
}
