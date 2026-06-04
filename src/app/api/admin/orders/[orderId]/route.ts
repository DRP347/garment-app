import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "@/lib/db";
import { requireAdminApi } from "@/lib/authz";
import OrderModel, { type OrderStatus } from "@/models/OrderModel";

type RouteContext = { params: Promise<{ orderId: string }> };
type StatusPayload = { status?: unknown };

const allowedStatuses: OrderStatus[] = [
  "in_process",
  "purchased",
  "cancelled",
  "ignored",
];

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

async function readBody(req: Request): Promise<StatusPayload | null> {
  try {
    return (await req.json()) as StatusPayload;
  } catch {
    return null;
  }
}

async function getOrderId(context: RouteContext) {
  const { orderId } = await context.params;
  return orderId;
}

function orderQuery(orderId: string) {
  if (Types.ObjectId.isValid(orderId)) {
    return { _id: orderId };
  }

  return { orderId };
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const admin = await requireAdminApi();
    if ("response" in admin) return admin.response;

    const body = await readBody(req);
    if (!body) return jsonError("Invalid JSON payload", 400);

    const status = String(body.status || "") as OrderStatus;
    if (!allowedStatuses.includes(status)) {
      return jsonError("Invalid order status", 400);
    }

    const orderId = await getOrderId(context);

    await connectDB();

    const update =
      status === "purchased"
        ? { $set: { status, purchasedAt: new Date() } }
        : { $set: { status }, $unset: { purchasedAt: "" } };

    const order = await OrderModel.findOneAndUpdate(
      orderQuery(orderId),
      update,
      { new: true, runValidators: true }
    )
      .lean()
      .exec();

    if (!order) return jsonError("Order not found", 404);

    return NextResponse.json(order);
  } catch (error) {
    console.error("ADMIN_ORDER_PATCH_ERROR:", error);
    return jsonError("Failed to update order", 500);
  }
}
