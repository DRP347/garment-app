import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import UserModel from "@/models/UserModel";

/**
 * Handles buyer registration
 * - Hashes password
 * - Saves business info fields
 * - Prevents duplicate email registration
 */

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
      accountType,
      businessName,
      businessType,
      taxId,
      website,
      budget,
      requirements,
      category,
      capacity,
    } = body;

    // ✅ Basic validation
    if (!name || !email || !password)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    // ✅ Prevent duplicate registration
    const existingUser = await UserModel.findOne({ email }).lean();
    if (existingUser)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user with all provided fields
    await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      shopName,
      accountType,
      businessName,
      businessType,
      taxId,
      website,
      budget,
      requirements,
      category,
      capacity,
      role: "buyer",
      status: "approved", // or "pending" if you want admin review
    });

    return NextResponse.json(
      { success: true, message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Registration error:", error.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
