import { Request, Response, NextFunction } from "express";
import { createTenant } from "./tenants.service";

export const registerTenant = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.body) {
            throw new Error("Request body is missing");
        }
        const { name, slug } = req.body;
        if (!name || !slug) {
            throw new Error("Name and slug are required");
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