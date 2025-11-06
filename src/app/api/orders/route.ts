import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";
import connectDB from "@/lib/db";
import OrderModel from "@/models/OrderModel";
import UserModel from "@/models/UserModel";
import mongoose from "mongoose";

const WA_PHONE = "917202809157"; // 91 + 10-digit

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, totalAmount } = await req.json();
    if (!Array.isArray(items) || !items.length || !totalAmount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Pull from BOTH places, then merge
    const db = mongoose.connection.useDb("TheGarmentGuyDB");
    const nextAuthUser: any =
      (await db.collection("users").findOne({ email: session.user.email })) || {};
    const customUser = await UserModel.findOne({ email: session.user.email }).lean();

    // merged user view
    const u = {
      name: customUser?.name ?? nextAuthUser?.name ?? "N/A",
      phone:
        customUser?.phone ??
        nextAuthUser?.phone ??
        nextAuthUser?.mobile ??
        nextAuthUser?.contact ??
        "Not Provided",
      businessName:
        customUser?.businessName ??
        customUser?.shopName ??
        nextAuthUser?.businessName ??
        "Not Provided",
      businessType:
        customUser?.businessType ??
        customUser?.accountType ??
        nextAuthUser?.businessType ??
        "Not Provided",
      _id: customUser?._id ?? nextAuthUser?._id,
    };

    if (!u._id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orderId = `GG-${Math.floor(100000 + Math.random() * 900000)}`;

    await OrderModel.create({
      userId: new mongoose.Types.ObjectId(u._id),
      items,
      total: totalAmount,
      status: "Pending",
      createdAt: new Date(),
    });

    const msg = `
🧾 *New Garment Guy Order!*

*Order ID:* ${orderId}
*Name:* ${u.name}
*Phone:* ${u.phone}
*Business:* ${u.businessName}
*Type:* ${u.businessType}
*Total:* ₹${totalAmount}

*Items:*
${items.map((i: any) => `• ${i.name} x${i.quantity}`).join("\n")}

Please confirm my order.`.trim();

    const whatsappURL = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;

    return NextResponse.json({ success: true, whatsappURL, orderId }, { status: 201 });
  } catch (err: any) {
    console.error("❌ Order POST error:", err?.message || err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
