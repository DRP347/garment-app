import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";
import connectDB from "@/lib/db";
import OrderModel from "@/models/OrderModel";
import UserModel from "@/models/UserModel";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await OrderModel.find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, totalAmount, address } = await req.json();
    if (!items || !totalAmount || !address) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Save order
    const newOrder = new OrderModel({
      userEmail: session.user.email,
      items,
      totalAmount,
      address,
      status: "Pending",
      createdAt: new Date(),
    });

    await newOrder.save();

    // Fetch user details
    const user = await UserModel.findOne({ email: session.user.email }).lean();
    const userName = user?.name || "N/A";
    const userPhone = user?.phone || "N/A";
    const businessName = user?.businessName || "N/A";
    const businessType = user?.businessType || "N/A";

    // Build WhatsApp message
    const orderId = `GG-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemsList = items
      .map((item: any) => `• ${item.name} x${item.quantity}`)
      .join("\n");

    const message = `
🧾 *New Garment Guy Order!*

*Order ID:* ${orderId}
*Name:* ${userName}
*Phone:* ${userPhone}
*Business:* ${businessName}
*Type:* ${businessType}
*Total:* ₹${totalAmount}

*Items:*
${itemsList}

Please confirm my order.
    `.trim();

    // WhatsApp redirect link (encoded)
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/917861988279?text=${encodedMessage}`;

    return NextResponse.json(
      { message: "Order created successfully", whatsappURL },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
