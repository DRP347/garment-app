import mongoose, { Schema, model, models, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  businessName?: string;
  email: string;
  password: string;
  businessType?: string;
  taxId?: string;
  website?: string;
  phone?: string;
  role: "buyer" | "seller" | "admin";
  status: "pending" | "approved" | "rejected";

  // Buyer-specific fields
  budget?: string;
  requirements?: string;

  // Seller-specific fields
  category?: string;
  capacity?: string;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    businessName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    businessType: {
      type: String,
      enum: ["retailer", "distributor", "manufacturer", "wholesaler", "other"],
      default: "other",
    },
    taxId: { type: String },
    website: { type: String },
    phone: { type: String },
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

    // Buyer-specific
    budget: { type: String },
    requirements: { type: String },

    // Seller-specific
    category: { type: String },
    capacity: { type: String },
  },
  { timestamps: true }
);

// ✅ Safe export pattern for Next.js hot reload and Edge runtime
let UserModel: Model<IUser>;
try {
  UserModel = mongoose.model<IUser>("User");
} catch {
  UserModel = mongoose.model<IUser>("User", UserSchema);
}

export default UserModel;
