import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";
import connectDB from "@/lib/db";
import AbandonedCartModel from "@/models/AbandonedCartModel";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
    }

    await AbandonedCartModel.create({
      userEmail: session.user.email,
      items,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: "Cart saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error saving abandoned cart:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
