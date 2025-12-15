/**
 * @swagger
 * /cart/{guestId}:
 *   get:
 *     summary: Get the current guest cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema:
 *           type: string
 *           example: "guest_12345"
 *     responses:
 *       200:
 *         description: Returns the cart for the guest
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

export const getCart = async (req: Request, res: Response) => {
    const { guestId } = req.params;

    const cart = await Cart.findOne({ guestId });
    res.json(cart ?? { guestId, items: [] });
};
