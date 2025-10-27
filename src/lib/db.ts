import mongoose from "mongoose";

let cached = (global as any)._mongoose;

if (!cached) {
  cached = (global as any)._mongoose = { conn: null, promise: null };
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("❌ Missing MONGODB_URI in environment");

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "TheGarmentGuyDB",
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
