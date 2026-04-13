import mongoose, { Schema, Document } from "mongoose";

export interface UserDoc extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "buyer" | "seller" | "admin";
  status: "pending" | "approved" | "rejected";
  phone?: string;
  shopName?: string;
  businessName?: string;
  businessType?: string;
  accountType?: string;
}

const UserSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "buyer" },
    status: { type: String, default: "pending" },
    phone: String,
    shopName: String,
    businessName: String,
    businessType: String,
    accountType: String,
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<UserDoc>("User", UserSchema);
