import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI not found in environment variables");
}

// Global caching (prevents multiple connections on hot reload)
let cached = global.mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "TheGarmentGuyDB",
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
}
