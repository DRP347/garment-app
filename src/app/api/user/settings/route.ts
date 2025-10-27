import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";            // you already have db.ts
import UserSettings from "@/models/UserSettings";
import { getUserId } from "@/lib/getUserId";

export async function GET(req: Request) {
  await connectDB();
  const userId = await getUserId(req);
  const doc = await UserSettings.findOne({ userId });
  return NextResponse.json(doc ?? {});
}

export async function PUT(req: Request) {
  await connectDB();
  const userId = await getUserId(req);
  const body = await req.json();

  const updated = await UserSettings.findOneAndUpdate(
    { userId },
    { userId, ...body },
    { upsert: true, new: true }
  );

  return NextResponse.json(updated);
}
