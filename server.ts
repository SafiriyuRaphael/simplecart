import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cartRoutes from "./src/routes/cart";
import checkoutRoutes from "./src/routes/checkout";
import connectDB from "./src/config/db";
import { setupSwagger } from "./src/config/swagger";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000", "https://yourdomain.com"],
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);


setupSwagger(app);

// 🟢 Routes
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);

app.get("/", (req, res) => res.send("API is running"));

// 🟢 Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// 🟢 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
