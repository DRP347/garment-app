import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string[]; // ✅ array (IMPORTANT)
  images: string[];
  price: number;
  stock: number;

  category: string;
  subCategory?: string;

  meta?: {
    sleeve?: "short" | "long";
    fabric?: string;
    moq?: number;
  };

  approved: boolean;
  sellerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },

    description: {
      type: [String], // ✅ FIXED
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    price: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      required: true,
      lowercase: true, // ✅ keeps filtering safe
    },

    subCategory: {
      type: String,
      lowercase: true,
    },

    meta: {
      sleeve: {
        type: String,
        enum: ["short", "long"],
      },
      fabric: String,
      moq: Number,
    },

    approved: {
      type: Boolean,
      default: true,
    },

    sellerId: String,
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;