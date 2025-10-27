import mongoose, { Schema, Document, Types } from "mongoose";

export interface CartItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartDoc extends Document {
  userId: Types.ObjectId;
  items: CartItem[];
  updatedAt: Date;
}

const CartItemSchema = new Schema<CartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const CartSchema = new Schema<CartDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

export default (mongoose.models.Cart as mongoose.Model<CartDoc>) ||
  mongoose.model<CartDoc>("Cart", CartSchema);
