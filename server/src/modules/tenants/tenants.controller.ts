import { Request, Response, NextFunction } from "express";
import { createTenant } from "./tenants.service";
import { AppError } from "../../core/middleware/error.middleware";

export const registerTenant = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.body) {
            throw new AppError("Request body is missing", 400);
        }
        const { name, slug } = req.body;
        if (!name || !slug) {
            throw new AppError("Name and slug are required", 400);
        }
        const tenant = await createTenant({ name, slug, currentUser: req.user! });
        res.status(201).json({
            success: true,
            data: tenant
        })
    }
    catch (error) {
        next(error);
    }
}