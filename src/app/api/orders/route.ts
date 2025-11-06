import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";
import connectDB from "@/lib/db";
import OrderModel from "@/models/OrderModel";
import UserModel from "@/models/UserModel";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json([], { status: 200 });

    const user = await UserModel.findOne({ email: session.user.email }).lean();
    if (!user?._id) return NextResponse.json([], { status: 200 });

    const orders = await OrderModel.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error("❌ Order GET error:", error?.message || error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { items, totalAmount, address } = body;

    if (!items?.length || !totalAmount)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // ✅ Fetch full user data
    const user = await UserModel.findOne({ email: session.user.email }).lean();
    if (!user?._id)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const orderId = `GG-${Math.floor(100000 + Math.random() * 900000)}`;

    await OrderModel.create({
      userId: new mongoose.Types.ObjectId(user._id),
      items,
      total: totalAmount,
      status: "Pending",
      createdAt: new Date(),
    });

    // ✅ Build WhatsApp message
    const msg = `
🧾 *New Garment Guy Order!*

*Order ID:* ${orderId}
*Name:* ${user?.name || "N/A"}
*Phone:* ${user?.phone || "Not Provided"}
*Business:* ${user?.businessName || "Not Provided"}
*Type:* ${user?.businessType || "Not Provided"}
*Total:* ₹${totalAmount}

*Items:*
${items.map((i: any) => `• ${i.name} x${i.quantity}`).join("\n")}

Please confirm my order.
    `.trim();

    const encoded = encodeURIComponent(msg);
    const whatsappURL = `https://wa.me/917202809157?text=${encoded}`;

    return NextResponse.json(
      { success: true, whatsappURL, orderId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Order POST error:", error?.message || error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
