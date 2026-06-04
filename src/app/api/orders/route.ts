import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import OrderModel from "@/models/OrderModel";
import UserModel from "@/models/UserModel";
import { siteConfig } from "@/lib/siteConfig";

type OrderItemPayload = {
  _id?: unknown;
  id?: unknown;
  productId?: unknown;
  name?: unknown;
  image?: unknown;
  price?: unknown;
  quantity?: unknown;
  sellerId?: unknown;
};

type OrderPayload = {
  items?: unknown;
  totalAmount?: unknown;
};

type NormalizedOrderItem = {
  productId?: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  sellerId?: string;
};

type BuyerRecord = {
  _id?: unknown;
  name?: string;
  phone?: string;
};

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

async function readBody(req: Request): Promise<OrderPayload | null> {
  try {
    return (await req.json()) as OrderPayload;
  } catch {
    return null;
  }
}

function cleanString(value: unknown) {
  return String(value || "").trim();
}

function cleanNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeItems(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const raw = item as OrderItemPayload;
      const name = cleanString(raw.name);
      if (!name) return null;

      const productId = cleanString(raw.productId ?? raw._id ?? raw.id);
      const image = cleanString(raw.image);
      const sellerId = cleanString(raw.sellerId);
      const price = Math.max(0, cleanNumber(raw.price));
      const quantity = Math.max(1, cleanNumber(raw.quantity, 1));

      return {
        ...(productId ? { productId } : {}),
        name,
        ...(image ? { image } : {}),
        price,
        quantity,
        ...(sellerId ? { sellerId } : {}),
      } satisfies NormalizedOrderItem;
    })
    .filter((item): item is NormalizedOrderItem => Boolean(item));
}

function orderTotal(items: NormalizedOrderItem[], submittedTotal: unknown) {
  const submitted = cleanNumber(submittedTotal, NaN);
  if (Number.isFinite(submitted) && submitted >= 0) return submitted;

  return items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

function buildWhatsAppUrl(orderId: string, items: NormalizedOrderItem[], total: number) {
  const lines = items
    .map(
      (item) =>
        `${item.name} - Qty: ${item.quantity} - ₹${item.price * item.quantity}`
    )
    .join("\n");

  const message = `New Garment Guy inquiry\n\nOrder ID: ${orderId}\n\n${lines}\n\nTotal: ₹${total}\n\nStatus: In Process`;

  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json([]);

    await connectDB();

    const orders = await OrderModel.find({
      $or: [
        { buyerEmail: session.user.email },
        { userEmail: session.user.email },
      ],
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("ORDERS_GET_ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return jsonError("Unauthorized", 401);

    const body = await readBody(req);
    if (!body) return jsonError("Invalid JSON payload", 400);

    const items = normalizeItems(body.items);
    if (!items.length) return jsonError("No items in order", 400);

    const totalAmount = orderTotal(items, body.totalAmount);
    const orderId = `TGG-${Math.floor(100000 + Math.random() * 900000)}`;
    const sellerId = items.find((item) => item.sellerId)?.sellerId;

    await connectDB();

    const user = (await UserModel.findOne({ email: session.user.email })
      .select("_id name email phone")
      .lean()
      .exec()) as BuyerRecord | null;

    const order = await OrderModel.create({
      orderId,
      buyerId: user?._id,
      buyerName: user?.name || session.user.name,
      buyerEmail: session.user.email,
      buyerPhone: user?.phone,
      userId: user?._id,
      userEmail: session.user.email,
      sellerId,
      source: "whatsapp",
      type: "buyer_order",
      items,
      totalAmount,
      total: totalAmount,
      status: "in_process",
      whatsappClickedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry created",
        orderId,
        order: order.toObject(),
        whatsappURL: buildWhatsAppUrl(orderId, items, totalAmount),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ORDER_POST_ERROR:", error);
    return jsonError("Failed to create inquiry", 500);
  }
}
