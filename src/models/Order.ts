import mongoose, { Schema, Document } from "mongoose";

export type PaymentMethod = "bank" | "cheque" | "paypal";
export type OrderStatus = "pending" | "paid" | "failed";

interface Address {
    firstName: string;
    lastName: string;
    company?: string;
    country: string;
    address: string;
    apartment?: string;
    city: string;
    postcode: string;
    email: string;
    phone: string;
}

interface OrderItem {
    name: string;
    price: number;
    quantity: number;
}

export interface OrderDocument extends Document {
    guestId: string;
    items: OrderItem[];

    billing: Address;
    shipping?: Address;

    orderNotes?: string;

    paymentMethod: PaymentMethod;
    status: OrderStatus;

    subtotal: number;
    shippingFee: number;
    total: number;
}

const addressSchema = new Schema<Address>({
    firstName: String,
    lastName: String,
    company: String,
    country: String,
    address: String,
    apartment: String,
    city: String,
    postcode: String,
    email: String,
    phone: String
});

const orderItemSchema = new Schema<OrderItem>({
    name: String,
    price: Number,
    quantity: Number
});

const orderSchema = new Schema<OrderDocument>(
    {
        guestId: { type: String, required: true },

        items: [orderItemSchema],

        billing: addressSchema,
        shipping: addressSchema,

        orderNotes: String,

        paymentMethod: {
            type: String,
            enum: ["bank", "cheque", "paypal"],
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        },

        subtotal: Number,
        shippingFee: Number,
        total: Number
    },
    { timestamps: true }
);

export default mongoose.model<OrderDocument>("Order", orderSchema);
