import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import connectDB from "@/lib/db";
import mongoose, { Document, Schema } from "mongoose";

interface ICart extends Document {
  userEmail: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
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
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);

/* -------------------------------------------------------------------------- */
/*                                   GET CART                                 */
/* -------------------------------------------------------------------------- */
export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authConfig);
    if (!session?.user?.email)
      return NextResponse.json({ items: [] }, { status: 200 });

    const cart = await CartModel.findOne({ userEmail: session.user.email }).lean<ICart | null>();
    return NextResponse.json({ items: cart?.items ?? [] }, { status: 200 });
  } catch (err: any) {
    console.error("❌ CART GET error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* -------------------------------------------------------------------------- */
/*                                   SAVE CART                                */
/* -------------------------------------------------------------------------- */
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authConfig);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Not logged in" }, { status: 200 });

    const { items } = await req.json();
    if (!Array.isArray(items))
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const result = await CartModel.findOneAndUpdate(
      { userEmail: session.user.email },
      { items, updatedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean<ICart>();

    return NextResponse.json({ success: true, items: result.items }, { status: 200 });
  } catch (err: any) {
    console.error("❌ CART POST error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* -------------------------------------------------------------------------- */
/*                                   CLEAR CART                               */
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
