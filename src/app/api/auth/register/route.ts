import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import UserModel from "@/models/UserModel";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      name,
      email,
      password,
      phone,
      shopName,
      businessName,
      businessType,
      accountType,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const exists = await UserModel.findOne({ email });
    if (exists)
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );

    const hashed = await bcrypt.hash(password, 10);

    await UserModel.create({
      name,
      email,
      password: hashed,
      phone,
      shopName,
      businessName,
      businessType,
      accountType,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
