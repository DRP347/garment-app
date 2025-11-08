import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String, default: "" },
    shopName: { type: String, default: "" },
    businessName: { type: String, default: "" },
    businessType: { type: String, default: "" },
    accountType: {
      type: String,
      enum: ["Retailer", "Wholesaler", "Buyer", "Other"],
      default: "Buyer",
    },
    role: { type: String, default: "buyer" },
    status: { type: String, default: "approved" },
  },
  { timestamps: true }
);

export default models?.User || model("User", UserSchema);
