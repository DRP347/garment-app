import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "@/pages/api/auth/[...nextauth]";
import connectDB from "@/lib/db";
import CartModel from "@/models/Cart";

export async function GET() {
  try {
    await connectDB();

    const session = (await getServerSession(authOptions)) as {
      user?: { email?: string };
    };

    if (!session?.user?.email)
      return NextResponse.json({ items: [] }, { status: 200 });

    const cart = await CartModel.findOne({
      userEmail: session.user.email,
    }).lean();

    return NextResponse.json(
      { items: cart?.items ?? [] },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ CART GET error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = (await getServerSession(authOptions)) as {
      user?: { email?: string };
    };

    if (!session?.user?.email)
      return NextResponse.json(
        { error: "Not logged in, using local cart only" },
        { status: 200 }
      );

    const { items } = await req.json();
    if (!Array.isArray(items))
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const userEmail = session.user.email;

    const updated = await CartModel.findOneAndUpdate(
      { userEmail },
      { $set: { items, updatedAt: new Date() } },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json(
      { success: true, items: updated?.items ?? [] },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ CART POST error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();

    const session = (await getServerSession(authOptions)) as {
      user?: { email?: string };
    };

    if (!session?.user?.email)
      return NextResponse.json({ success: false }, { status: 401 });

    await CartModel.deleteOne({ userEmail: session.user.email });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("❌ CART DELETE error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
