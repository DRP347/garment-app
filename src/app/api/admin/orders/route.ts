import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAdminApi } from "@/lib/authz";
import OrderModel from "@/models/OrderModel";

export async function GET() {
  try {
    const admin = await requireAdminApi();
    if ("response" in admin) return admin.response;

    await connectDB();

    const orders = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()
      .exec();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("ADMIN_ORDERS_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 }
    );
  }
}
