import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const client = await clientPromise;
    const db = client.db("TheGarmentGuyDB");

    if (!session?.user?.email) {
      return NextResponse.json({ items: [] });
    }

    const cart = await db.collection("carts").findOne({
      userEmail: session.user.email,
    });

    return NextResponse.json({ items: cart?.items || [] });
  } catch (err: any) {
    console.error("CART GET ERROR:", err);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("TheGarmentGuyDB");

    const body = await request.json();
    const { items } = body;

    await db.collection("carts").updateOne(
      { userEmail: session.user.email },
      { $set: { items } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("CART POST ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
