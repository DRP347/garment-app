import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongoose:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in .env.local");
}

const globalCache = globalThis._mongoose ?? {
  conn: null,
  promise: null,
};

export async function connectDB(): Promise<typeof mongoose> {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI, {
      dbName: "TheGarmentGuyDB",
      bufferCommands: false,
    });
  }

  globalCache.conn = await globalCache.promise;
  globalThis._mongoose = globalCache;
  return globalCache.conn;
}

export default connectDB;
