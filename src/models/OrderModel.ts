import mongoose, { Schema, model, models } from "mongoose";

if (!mongoose.models) mongoose.models = {};

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number },
        size: { type: Number },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// ✅ Prevent overwriting model on hot-reload (the key issue)
export default models?.Order || model("Order", OrderSchema);
