import mongoose, { Schema, model, models, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  shopName?: string;
  accountType?: "Retailer" | "Wholesaler";
  businessName?: string;
  businessType?: string;
  taxId?: string;
  website?: string;
  role: "buyer" | "seller" | "admin";
  status: "pending" | "approved" | "rejected";
  budget?: string;
  requirements?: string;
  category?: string;
  capacity?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 🔹 New registration fields
    phone: { type: String },
    shopName: { type: String },
    accountType: {
      type: String,
      enum: ["Retailer", "Wholesaler"],
      default: "Retailer",
    },

    // 🔹 Optional business info
    businessName: { type: String },
    businessType: {
      type: String,
      enum: ["retailer", "distributor", "manufacturer", "wholesaler", "other"],
      default: "other",
    },
    taxId: { type: String },
    website: { type: String },

    // 🔹 System control
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // 🔹 Buyer / Seller specifics
    budget: { type: String },
    requirements: { type: String },
    category: { type: String },
    capacity: { type: String },
  },
  { timestamps: true }
);

// ✅ Safe export pattern for Next.js hot reload & Edge runtime
let UserModel: Model<IUser>;
try {
  UserModel = mongoose.model<IUser>("User");
} catch {
  UserModel = mongoose.model<IUser>("User", UserSchema);
}

export default UserModel;
