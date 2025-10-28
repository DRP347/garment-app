import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";
import connectDB from "@/lib/db";
import AbandonedCartModel from "@/models/AbandonedCartModel";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const carts = await AbandonedCartModel.find({
      userEmail: session.user.email,
    })
      .sort({ timestamp: -1 })
      .lean();

    return NextResponse.json(carts, { status: 200 });
  } catch (error) {
    console.error("Error fetching user abandoned carts:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
