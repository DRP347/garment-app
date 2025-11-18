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
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      shopName,
      businessName,
      businessType,
      accountType,
    });

    return NextResponse.json(
      { message: "User created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
