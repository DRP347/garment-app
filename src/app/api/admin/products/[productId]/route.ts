import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/ProductModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

async function guard() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user?.role !== "admin") return null;
  return session;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const p = await Product.findById(params.id).lean();
  if (!p) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(p);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await guard())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const p = await Product.findByIdAndUpdate(params.id, body, { new: true });
  if (!p) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(p);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await guard())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
