import mongoose, { Schema, Document } from "mongoose";

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export interface CartDocument extends Document {
  guestId: string;
  items: CartItem[];
}

const cartItemSchema = new Schema<CartItem>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 }
});

const cartSchema = new Schema<CartDocument>(
  {
    guestId: {
      type: String,
      required: true,
      index: true
    },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

const Cart = mongoose.model<CartDocument>("Cart", cartSchema);
export default Cart;
