import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("TheGarmentGuyDB");
    const { id } = params;

    if (!ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // normalize
    const price = typeof product.price === "object"
      ? Number(product.price.$numberInt)
      : Number(product.price);
    const stock = typeof product.stock === "object"
      ? Number(product.stock.$numberInt)
      : Number(product.stock);

    const images = Array.isArray(product.images) && product.images.length
      ? product.images
      : ["/placeholder.png"];

    return NextResponse.json({
      _id: product._id.toString(),
      name: product.name || "Unnamed Product",
      description: product.description || "",
      price,
      stock,
      category: product.category || "Uncategorized",
      images,
    });
  } catch (err) {
    console.error("Product GET error:", err);
    return NextResponse.json(
      { error: "Failed to load product" },
      { status: 500 }
    );
  }
}
