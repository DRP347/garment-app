import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

// ✅ Define Cart Schema (only if not already in models)
const CartSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, unique: true },
    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "carts" }
);

const CartModel =
  mongoose.models.Cart || mongoose.model("Cart", CartSchema);

/* -------------------------------------------------------------------------- */
/*                                 🧾 GET CART                                 */
/* -------------------------------------------------------------------------- */
export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authConfig);
    if (!session?.user?.email)
      return NextResponse.json({ items: [] }, { status: 200 });

    const cart = await CartModel.findOne({
      userEmail: session.user.email,
    }).lean();

    return NextResponse.json({ items: cart?.items || [] }, { status: 200 });
  } catch (err: any) {
    console.error("❌ CART GET error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* -------------------------------------------------------------------------- */
/*                                 🧩 SAVE CART                                */
/* -------------------------------------------------------------------------- */
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authConfig);

    // 🧠 If user not logged in, skip DB — handled in localStorage
    if (!session?.user?.email)
      return NextResponse.json(
        { error: "Not logged in, using local cart only" },
        { status: 200 }
      );

    const { items } = await req.json();
    if (!Array.isArray(items))
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const userEmail = session.user.email;

    // ✅ Upsert user's cart
    const result = await CartModel.findOneAndUpdate(
      { userEmail },
      { items, updatedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, items: result.items }, { status: 200 });
  } catch (err: any) {
    console.error("❌ CART POST error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* -------------------------------------------------------------------------- */
/*                                 🗑 CLEAR CART                               */
/* -------------------------------------------------------------------------- */
export async function DELETE() {
  try {
    await connectDB();
    const session = await getServerSession(authConfig);
    if (!session?.user?.email)
      return NextResponse.json({ success: false }, { status: 401 });

    await CartModel.deleteOne({ userEmail: session.user.email });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("❌ CART DELETE error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
