import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  images: string[];
  price: number;
  stock: number;
  category?: string;
  approved: boolean;
  sellerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    images: { type: [String], default: [] }, // multiple image URLs
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, default: "General" },
    approved: { type: Boolean, default: true }, // visible by default
    sellerId: { type: String },
  },
  { timestamps: true }
);

export default models.Product || model<IProduct>("Product", ProductSchema);
