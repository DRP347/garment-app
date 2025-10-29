import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";
import connectDB from "@/lib/db";
import OrderModel from "@/models/OrderModel";
import UserModel from "@/models/UserModel"; // ensure this exists and contains new fields

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
  } catch (error) {
    console.error("Error fetching orders:", error);
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
    if (!items || !totalAmount || !address)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // Get user details
    const user = await UserModel.findOne({ email: session.user.email }).lean();

    const newOrder = new OrderModel({
      userEmail: session.user.email,
      items,
      totalAmount,
      address,
      status: "Pending",
      createdAt: new Date(),
    });

    await newOrder.save();

    // WhatsApp message format
    const message = `
🧾 *New Garment Guy Order!*

*Order ID:* GG-${newOrder._id.toString().slice(-6).toUpperCase()}
*Customer:* ${user?.name || "N/A"}
*Phone:* ${user?.phone || "N/A"}
*Shop:* ${user?.shopName || "N/A"}
*Account Type:* ${user?.accountType || "N/A"}
*Total:* ₹${totalAmount}

*Items:*
${items.map((i: any) => `• ${i.name} x${i.quantity}`).join("\n")}

Please confirm my order.
`;

    console.log("New order message:", message);

    // You can integrate Twilio or WhatsApp API here if needed
    // e.g. await sendWhatsAppMessage("+917861988279", message);

    return NextResponse.json(
      { message: "Order created successfully", orderId: newOrder._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
