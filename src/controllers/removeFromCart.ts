/**
 * @swagger
 * /cart/remove:
 *   post:
 *     summary: Remove an item from the guest cart
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
 *     responses:
 *       200:
 *         description: Item removed, returns updated cart
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
 */

import { Request, Response } from "express";
import Cart from "../models/Cart";

export const removeFromCart = async (req: Request, res: Response) => {
    const { guestId, name } = req.body as {
        guestId: string
        name: string
    };


    const cart = await Cart.findOne({ guestId });
    if (!cart) return res.json({ items: [] });

    cart.items = cart.items.filter(item => item.name !== name);
    await cart.save();

    res.json(cart);
};
