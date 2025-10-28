import { NextResponse } from "next/server";
import authOptions from "@/auth.config";
import { getServerSession } from "next-auth";
import OrderModel from "@/models/OrderModel";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await OrderModel.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
