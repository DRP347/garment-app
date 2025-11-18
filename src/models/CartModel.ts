import mongoose, { Schema, model, models } from "mongoose";

const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,     // FIXED
      index: true         // NOT UNIQUE anymore
    },
    items: [
      {
        id: String,
        name: String,
        image: String,
        price: Number,
        quantity: Number,
        size: Number,
      },
    ],
  },
  { timestamps: true }
);

export default models.Cart || model("Cart", CartSchema);
