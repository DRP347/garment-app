import { Schema, model, models } from "mongoose";

export type OrderStatus = "in_process" | "purchased" | "cancelled" | "ignored";

const OrderItemSchema = new Schema(
  {
    productId: String,
    name: { type: String, required: true },
    image: String,
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    sellerId: String,
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, index: true },
    buyerId: { type: Schema.Types.ObjectId, ref: "User" },
    buyerName: String,
    buyerEmail: { type: String, index: true },
    buyerPhone: String,

    // Kept for compatibility with older order documents and pages.
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userEmail: { type: String, index: true },

    sellerId: String,
    sellerName: String,
    source: { type: String, enum: ["whatsapp"], default: "whatsapp" },
    type: { type: String, default: "buyer_order" },
    items: { type: [OrderItemSchema], default: [] },
    totalAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["in_process", "purchased", "cancelled", "ignored"],
      default: "in_process",
      index: true,
    },
    whatsappClickedAt: Date,
    purchasedAt: Date,
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);
