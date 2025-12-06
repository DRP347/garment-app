import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ⭐ REQUIRED FIX ⭐

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("TheGarmentGuyDB");

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.error("Product fetch failed:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
