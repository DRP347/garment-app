import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import clientPromise from "@/lib/mongodb";

/**
 * CART API
 *  - GET  → fetch user cart
 *  - POST → sync cart to MongoDB
 *  - optimized for >1000 users
 */

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email)
      return NextResponse.json({ items: [] }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("TheGarmentGuyDB");
    const collection = db.collection("carts");

    // --- ensure indexes once ---
    const indexes = await collection.indexes();

    if (!indexes.some((i) => i.name === "userEmail_updatedAt")) {
      await collection.createIndex(
        { userEmail: 1, updatedAt: -1 },
        {
          unique: true,
          name: "userEmail_updatedAt",
          partialFilterExpression: { userEmail: { $type: "string" } },
        }
      );
    }

    if (!indexes.some((i) => i.name === "ttl_expire_after_30_days")) {
      await collection.createIndex(
        { updatedAt: 1 },
        { expireAfterSeconds: 2592000, name: "ttl_expire_after_30_days" } // 30 days
      );
    }

    const cart = await collection.findOne({ userEmail: session.user.email });
    return NextResponse.json({ items: cart?.items || [] });
  } catch (err: any) {
    console.error("❌ CART GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
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
    const collection = db.collection("carts");

    // --- re-check indexes on write path ---
    const indexes = await collection.indexes();

    if (!indexes.some((i) => i.name === "userEmail_updatedAt")) {
      await collection.createIndex(
        { userEmail: 1, updatedAt: -1 },
        {
          unique: true,
          name: "userEmail_updatedAt",
          partialFilterExpression: { userEmail: { $type: "string" } },
        }
      );
    }

    if (!indexes.some((i) => i.name === "ttl_expire_after_30_days")) {
      await collection.createIndex(
        { updatedAt: 1 },
        { expireAfterSeconds: 2592000, name: "ttl_expire_after_30_days" }
      );
    }

    // --- atomic upsert ---
    await collection.updateOne(
      { userEmail: session.user.email },
      {
        $set: {
          userEmail: session.user.email,
          items,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ CART POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
