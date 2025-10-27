import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/ProductModel";

export async function POST(req: Request) {
  try {
    const adminToken = process.env.ADMIN_TOKEN || "";
    const headerToken = req.headers.get("x-admin-token");

    if (!headerToken || headerToken !== adminToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    if (!body?.name || !body?.price) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const product = await Product.create({
      name: body.name,
      description: body.description || "",
      price: body.price,
      stock: body.stock ?? 0,
      category: body.category || "General",
      approved: body.approved ?? true,
      images: Array.isArray(body.images) ? body.images : [],
    });

    return NextResponse.json({ item: product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}
