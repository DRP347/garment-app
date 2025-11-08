import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";
import connectDB from "@/lib/db";
import OrderModel from "@/models/OrderModel";
import UserModel from "@/models/UserModel";
import mongoose from "mongoose";

const WA_PHONE = "917861988279";
const MIN_QTY = 20;

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json([], { status: 200 });

    const userDoc = await UserModel.findOne({ email: session.user.email }).lean();
    if (!userDoc) return NextResponse.json([], { status: 200 });

    const user = userDoc as { _id: mongoose.Types.ObjectId };
    const orders = await OrderModel.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders, { status: 200 });
  } catch (e) {
    console.error("GET /orders error:", e);
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
    const rawItems: Array<{ name: string; quantity: number; price?: number; size?: number }> =
      Array.isArray(body.items) ? body.items : [];
    const totalAmount = Number(body.totalAmount || 0);

    if (!rawItems.length || !totalAmount)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const userDoc = await UserModel.findOne({ email: session.user.email }).lean();
    if (!userDoc)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const user = userDoc as {
      _id: mongoose.Types.ObjectId;
      name?: string;
      phone?: string;
      businessName?: string;
      shopName?: string;
      businessType?: string;
      accountType?: string;
    };

    const items = rawItems.map((i) => ({
      name: i.name,
      quantity: Math.max(MIN_QTY, Number(i.quantity || 0)),
      price: i.price,
      size: i.size,
    }));

    const orderId = `GG-${Math.floor(100000 + Math.random() * 900000)}`;

    await OrderModel.create({
      userId: new mongoose.Types.ObjectId(String(user._id)),
      orderId,
      items,
      total: totalAmount,
      status: "Pending",
      createdAt: new Date(),
    });

    const lines = [
      "🧾 *New Garment Guy Order!*",
      "",
      `*Order ID:* ${orderId}`,
      `*Name:* ${user.name || "N/A"}`,
      `*Phone:* ${user.phone || "N/A"}`,
      `*Business:* ${user.businessName || user.shopName || "N/A"}`,
      `*Type:* ${user.businessType || user.accountType || "N/A"}`,
      "",
      "*Items:*",
      ...items.map(
        (i) =>
          `• ${i.name}${i.size ? ` (Size ${i.size})` : ""} × ${i.quantity}${
            i.price ? ` — ₹${i.price}` : ""
          }`
      ),
      "",
      `*Total:* ₹${totalAmount.toLocaleString("en-IN")}`,
      `🕒 *Status:* Pending`,
      "",
      "Thank you for ordering with The Garment Guy.",
    ];

    const whatsappURL = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;

    return NextResponse.json({ success: true, whatsappURL, orderId }, { status: 201 });
  } catch (e) {
    console.error("POST /orders error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
