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
    if (!session?.user?.email) {
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

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, totalAmount, address } = await req.json();
    if (!items || !totalAmount || !address) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ✅ Fetch logged-in user details
    const user = await UserModel.findOne({ email: session.user.email }).lean();

    // ✅ Create and save order
    const newOrder = new OrderModel({
      userEmail: session.user.email,
      items,
      totalAmount,
      address,
      status: "Pending",
      createdAt: new Date(),
    });

    await newOrder.save();

    // ✅ Generate WhatsApp order message with user details
    const message = `
🧾 *New Garment Guy Order!*

*Order ID:* GG-${newOrder._id.toString().slice(-6).toUpperCase()}
*Customer:* ${user?.name || "N/A"}
*Phone:* ${user?.phone || "N/A"}
*Shop:* ${user?.shopName || user?.businessName || "N/A"}
*Account Type:* ${user?.accountType || user?.businessType || "N/A"}

*Total:* ₹${totalAmount}

*Items:*
${items.map((i: any) => `• ${i.name} x${i.quantity}`).join("\n")}

Please confirm my order.
    `.trim();

    // ✅ Log to console (you can send this to WhatsApp API later)
    console.log("🟢 WhatsApp Message:\n", message);

    // Example (optional WhatsApp API integration):
    // await fetch(`https://api.whatsapp.com/send?phone=917861988279&text=${encodeURIComponent(message)}`);

    return NextResponse.json(
      {
        message: "Order created successfully",
        orderId: newOrder._id,
        whatsappMessage: message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
