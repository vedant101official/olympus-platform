import { Request, Response, NextFunction, response } from "express";
import { CreateUser } from "./user.service";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name, email, password, role, tenantId} = req.body;
        if (!name || !email || !password || !tenantId) {
            throw new Error("Missing required fields");
        }

        const user = await CreateUser({ name, email, password, role, tenantId });
        await user.save();

        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

