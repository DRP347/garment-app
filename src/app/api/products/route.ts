import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("TheGarmentGuyDB");
    const collection = db.collection("products");

    const products = await collection
      .find({ approved: true })
      .sort({ updatedAt: -1, createdAt: -1 })
      .toArray();

    return NextResponse.json(products, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err: unknown) {
    console.error("❌ Products API error:", err);
    const message = err instanceof Error ? err.message : "Failed to load products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
