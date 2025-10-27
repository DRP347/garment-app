import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import UserModel from "@/models/UserModel";

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      role,
      name,
      email,
      password,
      phone,
      location,
      businessName,
      businessType,
      website,
      brandVision,
    } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      role,
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      businessName,
      businessType,
      website,
      brandVision,
      status: "pending", // default until approval
    });

    return NextResponse.json(
      { message: "User registered successfully!", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
