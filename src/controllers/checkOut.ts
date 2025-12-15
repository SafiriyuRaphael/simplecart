/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Create an order from the guest cart
 *     tags:
 *       - Checkout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guestId:
 *                 type: string
 *                 example: "guest_12345"
 *               billing:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   companyName:
 *                     type: string
 *                     example: "ACME Inc."
 *                   address:
 *                     type: string
 *                     example: "123 Main St"
 *                   apartmentSuiteUnit:
 *                     type: string
 *                     example: "Apt 4B"
 *                   city:
 *                     type: string
 *                     example: "New York"
 *                   postcode:
 *                     type: string
 *                     example: "10001"
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *               shipping:
 *                 type: object
 *                 description: Only required if shipToDifferentAddress is true
 *               shipToDifferentAddress:
 *                 type: boolean
 *                 example: false
 *               orderNotes:
 *                 type: string
 *                 example: "Leave at front door"
 *               paymentMethod:
 *                 type: string
 *                 enum: [paypal, bank, cheque]
 *                 example: "paypal"
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Missing required fields or cart empty
 */

import { Request, Response } from "express";
import Cart from "../models/Cart";
import Order from "../models/Order";

const SHIPPING_FEE = 7.0;

export const checkout = async (req: Request, res: Response) => {
    const {
        guestId,
        billing,
        shipping,
        shipToDifferentAddress,
        orderNotes,
        paymentMethod
    } = req.body;

    if (!guestId || !billing || !paymentMethod) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const cart = await Cart.findOne({ guestId });

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    const subtotal = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const total = subtotal + SHIPPING_FEE;

    const order = await Order.create({
        guestId,
        items: cart.items,

        billing,
        shipping: shipToDifferentAddress ? shipping : billing,

        orderNotes,
        paymentMethod,

        subtotal,
        shippingFee: SHIPPING_FEE,
        total
    });

    // Clear cart AFTER order creation
    await Cart.deleteOne({ guestId });

    // Payment handling decision
    if (paymentMethod === "paypal") {
        return res.status(201).json({
            message: "Redirect to PayPal",
            orderId: order._id,
            total
        });
    }

    // Bank & Cheque = manual payment
    res.status(201).json({
        message: "Order placed successfully",
        order
    });
};
