import { checkout } from "../controllers/checkOut";
import { apiKeyGuard } from "../middleware/apiKeyGuard";
import { Router } from "express";

const router = Router();
router.post("/", apiKeyGuard, checkout);
export default router;