import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import clientPromise from "@/lib/mongodb";

/**
 * CART API — fixed for null userId errors.
 */

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email)
      return NextResponse.json({ items: [] }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("TheGarmentGuyDB");
    const carts = db.collection("carts");

    const cart = await carts.findOne({ userEmail: session.user.email });
    return NextResponse.json({ items: cart?.items || [] });
  } catch (err: any) {
    console.error("❌ CART GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { items } = await req.json();
    if (!Array.isArray(items))
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("TheGarmentGuyDB");
    const carts = db.collection("carts");

    // Ensure unique index only on userEmail
    await carts.createIndex({ userEmail: 1 }, { unique: true });

    // Upsert safely
    await carts.updateOne(
      { userEmail: session.user.email },
      { $set: { items, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ CART POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
