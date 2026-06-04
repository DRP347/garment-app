import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import UserModel from "@/models/UserModel";

type AccountType = "buyer" | "seller";

function normalizeAccountType(value: unknown): AccountType | null {
  if (value === "buyer" || value === "seller") return value;
  return null;
}

async function readBody(req: Request) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await readBody(req);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      phone,
      shopName,
      businessName,
      businessType,
      accountType,
      location,
    } = body;
    const role = normalizeAccountType(accountType);
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPassword = String(password || "");
    const cleanPhone = String(phone || "").trim();
    const cleanBusinessName = String(businessName || shopName || "").trim();
    const cleanBusinessType = String(businessType || "").trim();
    const cleanLocation = String(location || "").trim();

    if (!role) {
      return NextResponse.json(
        { error: "Choose buyer or seller account type" },
        { status: 400 }
      );
    }

    if (
      !cleanName ||
      !cleanEmail ||
      !cleanPassword ||
      !cleanPhone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (cleanPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (role === "seller" && (!cleanBusinessName || !cleanBusinessType)) {
      return NextResponse.json(
        { error: "Business name and business type are required for sellers" },
        { status: 400 }
      );
    }

    const exists = await UserModel.findOne({ email: cleanEmail });
    if (exists) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    await UserModel.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role,
      phone: cleanPhone,
      shopName: role === "seller" ? cleanBusinessName : undefined,
      businessName: role === "seller" ? cleanBusinessName : undefined,
      businessType: role === "seller" ? cleanBusinessType : undefined,
      location: role === "seller" ? cleanLocation : undefined,
      accountType: role,
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
