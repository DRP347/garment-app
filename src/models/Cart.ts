import mongoose, { Schema, Document, models } from "mongoose";

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
}

const CartSchema = new Schema<ICart>({
  userId: { type: String, required: true, unique: true },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      image: String,
      quantity: { type: Number, default: 1 },
    },
  ],
});

export default models.Cart || mongoose.model<ICart>("Cart", CartSchema);
