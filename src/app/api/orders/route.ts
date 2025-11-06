import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";
import connectDB from "@/lib/db";
import OrderModel from "@/models/OrderModel";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { items, totalAmount } = body;

    if (!items?.length || !totalAmount)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // ✅ Fetch user directly from "users" collection (used by NextAuth)
    const db = mongoose.connection.useDb("TheGarmentGuyDB");
    const userDoc = await db.collection("users").findOne({ email: session.user.email });

    if (!userDoc)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const orderId = `GG-${Math.floor(100000 + Math.random() * 900000)}`;

    await OrderModel.create({
      userId: new mongoose.Types.ObjectId(userDoc._id),
      items,
      total: totalAmount,
      status: "Pending",
      createdAt: new Date(),
    });

    // ✅ Compose a WhatsApp message with all possible info
    const msg = `
🧾 *New Garment Guy Order!*

*Order ID:* ${orderId}
*Name:* ${userDoc.name || "N/A"}
*Phone:* ${userDoc.phone || userDoc.mobile || userDoc.contact || "N/A"}
*Business:* ${userDoc.businessName || userDoc.shopName || "N/A"}
*Type:* ${userDoc.businessType || userDoc.accountType || "N/A"}
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
  } catch (err: any) {
    console.error("❌ Order POST error:", err.message || err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
