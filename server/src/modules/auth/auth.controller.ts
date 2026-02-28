import { Request, Response, NextFunction } from "express";
import { LoginUser } from "./auth.service";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, tenantId } = req.body;
        if (!email || !password || !tenantId) {
            throw new Error('Email, password and tenantId are required');
        }
        const token = await LoginUser({ email, password, tenantId });
        console.log("Login successful, token generated", token);
        res.status(200).json({
            success: true,
            token
        });

    } catch (error) {
        next(error);
    }

}