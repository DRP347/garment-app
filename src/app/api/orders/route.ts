import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json([]);

    const client = await clientPromise;
    const db = client.db("TheGarmentGuyDB");

    const orders = await db
      .collection("orders")
      .find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(orders);
  } catch (err: any) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { items, totalAmount } = await req.json();

    if (!items?.length) {
      return NextResponse.json(
        { error: "No items in order" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("TheGarmentGuyDB");

    const orderId = "TGG-" + Math.floor(100000 + Math.random() * 900000);

    const orderData = {
      orderId,
      userEmail: session.user.email,
      items,
      total: totalAmount,
      status: "Pending",
      createdAt: new Date(),
    };

    await db.collection("orders").insertOne(orderData);

    // Build WhatsApp message
    const lines = items
      .map(
        (i: any) =>
          `${i.name} — Qty: ${i.quantity} — ₹${i.price * i.quantity}`
      )
      .join("%0A");

    const whatsappURL = `https://wa.me/918849336709?text=*New%20Order%20Placed*%0A%0A*Order ID:*%20${orderId}%0A%0A${lines}%0A%0A*Total:*%20₹${totalAmount}`;

    return NextResponse.json({
      success: true,
      orderId,
      whatsappURL,
    });

  } catch (err: any) {
    console.error("ORDER POST ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
