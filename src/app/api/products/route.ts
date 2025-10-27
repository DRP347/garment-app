import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("TheGarmentGuyDB");
    const collection = db.collection("products");

    const products = await collection.find({ approved: true }).toArray();
    return NextResponse.json(products);
  } catch (err: any) {
    console.error("❌ Products API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
