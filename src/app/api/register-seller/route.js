import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UserModel from "@/models/UserModel";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashed,
      role: "seller",
    });

    await newUser.save();
    return NextResponse.json({ message: "Seller registered" }, { status: 201 });
  } catch (err) {
    console.error("Error registering seller:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
