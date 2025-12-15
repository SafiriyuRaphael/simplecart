/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a product to the guest cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *           example: "bafutostudents"
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
 *               product:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Product Name"
 *                   price:
 *                     type: number
 *                     example: 12.5
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Invalid payload
 */

import { Request, Response } from "express";
import Cart from "../models/Cart";

export const addToCart = async (req: Request, res: Response) => {
    const { guestId, product } = req.body as {
        guestId: string;
        product: { name: string; price: number };
    };

    if (!guestId || !product?.name || !product?.price) {
        return res.status(400).json({ message: "Invalid payload" });
    }

    let cart = await Cart.findOne({ guestId });

    if (!cart) {
        cart = await Cart.create({
            guestId,
            items: [{ ...product, quantity: 1 }]
        });
    } else {
        const item = cart.items.find(
            i => i.name === product.name
        );

        if (item) {
            item.quantity += 1;
        } else {
            cart.items.push({ ...product, quantity: 1 });
        }

        await cart.save();
    }

    res.json(cart);
};
