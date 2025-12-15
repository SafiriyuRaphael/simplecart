/**
 * @swagger
 * /cart/update-quantity:
 *   post:
 *     summary: Update the quantity of an item in the guest cart
 *     tags:
 *       - Cart
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
 *               name:
 *                 type: string
 *                 example: "Product Name"
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Returns updated cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 guestId:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       quantity:
 *                         type: number
 *       400:
 *         description: Invalid quantity
 *       404:
 *         description: Cart or item not found
 */

import { Request, Response } from "express";
import Cart from "../models/Cart";

export const updateQuantity = async (req: Request, res: Response) => {
    const { guestId, name, quantity } = req.body as {
        guestId: string;
        name: string; quantity: number
    };

    if (quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ guestId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.name === name);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
};
