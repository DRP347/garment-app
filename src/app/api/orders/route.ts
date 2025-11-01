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
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await OrderModel.find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(orders, { status: 200 });
  } catch (e) {
    console.error("Order GET error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { items, totalAmount, address } = await req.json();
    if (!items || !totalAmount)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const user = await UserModel.findOne({ email: session.user.email }).lean();
    const orderId = `GG-${Math.floor(100000 + Math.random() * 900000)}`;

    await OrderModel.create({
      userEmail: session.user.email,
      items,
      totalAmount,
      address,
      status: "Pending",
      createdAt: new Date(),
    });

    const msg = `
🧾 *New Garment Guy Order!*

*Order ID:* ${orderId}
*Name:* ${user?.name || "N/A"}
*Phone:* ${user?.phone || "N/A"}
*Business:* ${user?.businessName || "N/A"}
*Type:* ${user?.businessType || "N/A"}
*Total:* ₹${totalAmount}

*Items:*
${items.map((i: any) => `• ${i.name} x${i.quantity}`).join("\n")}

Please confirm my order.
    `.trim();

    const encoded = encodeURIComponent(msg);
    const whatsappURL = `https://wa.me/917861988279?text=${encoded}`;
    return NextResponse.json({ success: true, whatsappURL }, { status: 201 });
  } catch (e) {
    console.error("Order POST error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
