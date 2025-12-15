import { addToCart } from "../controllers/addToCart";
import { apiKeyGuard } from "../middleware/apiKeyGuard";
import { getCart } from "../controllers/getCart";
import { removeFromCart } from "../controllers/removeFromCart";
import { updateQuantity } from "../controllers/updateQuantity";


import { Router } from "express";
const router = Router();

router.post("/add", apiKeyGuard, addToCart);
router.get("/:guestId", apiKeyGuard, getCart);
router.post("/remove", apiKeyGuard, removeFromCart);
router.post("/update-quantity", apiKeyGuard, updateQuantity);
export default router;

