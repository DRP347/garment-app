import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import connectDB from "@/lib/db";
import OrderModel from "@/models/OrderModel";
import User, { UserDoc } from "@/models/UserModel";
import mongoose from "mongoose";

const MIN_QTY = 20;

type RawItem = {
  name: string;
  quantity: number;
  price?: number;
  size?: number;
};

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions) as {
      user?: { email?: string };
    } | null;

    if (!session?.user?.email)
      return NextResponse.json([], { status: 200 });

    const user = await User.findOne({ email: session.user.email })
      .lean<UserDoc | null>();

    if (!user)
      return NextResponse.json([], { status: 200 });

    const orders = await OrderModel.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.error("GET Orders ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions) as {
      user?: { email?: string };
    } | null;

    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Read Request Body
    const body = await req.json();
    const rawItems: RawItem[] = body.items;
    const totalAmount = Number(body.totalAmount || 0);

    if (!rawItems?.length || !totalAmount)
      return NextResponse.json(
        { error: "Missing items or totalAmount" },
        { status: 400 }
      );

    // Fetch user data
    const user = await User.findOne({ email: session.user.email })
      .lean<UserDoc | null>();

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Use fields from UserModel
    const customerName = user.name || "Unknown";
    const customerPhone = user.phone || "N/A";
    const customerAddress =
      user.businessName ||
      user.shopName ||
      user.businessType ||
      "No address provided";

    const items = rawItems.map((i) => ({
      name: i.name,
      quantity: Math.max(MIN_QTY, i.quantity),
      price: i.price,
      size: i.size,
    }));

    const orderId = `GG-${Math.floor(100000 + Math.random() * 900000)}`;

    await OrderModel.create({
      userId: new mongoose.Types.ObjectId(user._id),
      orderId,
      items,
      total: totalAmount,
      status: "Pending",
      customerName,
      customerPhone,
      customerAddress,
      createdAt: new Date(),
    });

    // Generate WhatsApp Message
    const message = `
*New Order — The Garment Guy*
Order ID: *${orderId}*

*Customer Details*
Name: ${customerName}
Phone: ${customerPhone}
Address: ${customerAddress}

*Order Summary*
${items
  .map(
    (i) => `• ${i.name} — ${i.quantity} pcs × ₹${i.price} = ₹${i.quantity * (i.price || 0)}`
  )
  .join("\n")}

*Total:* ₹${totalAmount}
    `;

    const whatsappURL =
      "https://wa.me/919879027882?text=" +
      encodeURIComponent(message);

    return NextResponse.json(
      {
        success: true,
        orderId,
        whatsappURL,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST Orders ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
