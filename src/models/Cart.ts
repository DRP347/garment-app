import mongoose, { Schema, Model } from "mongoose";

export interface CartItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartDoc {
  userEmail: string;
  items: CartItem[];
  updatedAt: Date;
}

const CartSchema = new Schema<CartDoc>(
  {
    userEmail: { type: String, required: true, unique: true },
    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "carts", versionKey: false }
);

// FIX: allow deleting model safely
if (mongoose.models.Cart) {
  delete (mongoose.models as any).Cart;
}

const CartModel: Model<CartDoc> =
  mongoose.models.Cart || mongoose.model<CartDoc>("Cart", CartSchema);

export default CartModel;
