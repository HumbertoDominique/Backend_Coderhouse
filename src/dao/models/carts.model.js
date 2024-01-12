import mongoose from "mongoose";

export const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
});
export const cartModel = mongoose.model("carts", cartSchema);
