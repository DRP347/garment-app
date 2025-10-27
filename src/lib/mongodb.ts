import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to your .env file");
}

if (process.env.NODE_ENV === "development") {
  // use global cache in dev mode
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
