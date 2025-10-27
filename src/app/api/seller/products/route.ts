import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/ProductModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const mine = await Product.find({ sellerId: (session.user as any).email }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(mine, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // role check optional; sellers expected
    const role = (session.user as any).role || "buyer";
    if (role !== "seller") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await connectDB();
    const body = await req.json();

    if (!body.name || !body.price || !body.stock)
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });

    const doc = await Product.create({
      name: body.name,
      description: body.description || "",
      images: Array.isArray(body.images) ? body.images : [],
      price: Number(body.price),
      stock: Number(body.stock),
      category: body.category || "",
      approved: false, // requires admin approval
      sellerId: (session.user as any).email,
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || "Error" }, { status: 500 });
  }
}
