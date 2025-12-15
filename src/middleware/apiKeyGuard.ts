import { Request, Response, NextFunction } from "express";

export const apiKeyGuard = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"];
    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};
