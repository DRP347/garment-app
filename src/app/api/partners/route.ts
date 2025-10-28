import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";
import connectDB from "@/lib/db";
import UserModel from "@/models/UserModel";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}

export async function GET() {
  try {
    await connectDB();

    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const partners = await UserModel.find({ role: "seller" }).lean();
    return NextResponse.json(partners, { status: 200 });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
