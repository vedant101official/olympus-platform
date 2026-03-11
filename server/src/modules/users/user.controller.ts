import { Request, Response, NextFunction } from "express";
import { AppError } from "../../core/middleware/error.middleware";
import { CreateUser, softDeleteUser, restoreUser, hardDeleteUser, getAllUsersService, getUserByIdService } from "./user.service";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getAllUsersService({ user: req.user! });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id as string;
        if (!userId) {
            console.log("Missing userId in request params");
            throw new AppError("Missing userId", 400);
        }

        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }

        const user = await getUserByIdService({ userId, currentUser: req.user! });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const registrarTenantId = req.user?.tenantId;
        const registrarRole = req.user?.role;
        const { name, email, password, role, tenantId } = req.body;
        if (!name || !email || !password || !tenantId) {
            throw new AppError("Missing required fields", 400);
        }

        const user = await CreateUser({ name, email, password, role, tenantId, registrarTenantId: registrarTenantId!, registrarRole: registrarRole! });
        await user.save();

        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

export const deactivateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id as string;
        if (!userId) {
            console.log("Missing userId in request params");
            throw new AppError("Missing userId", 400);
        }

        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }

        const user = await softDeleteUser({ userId, currentUser: req.user! });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id as string;
        if (!userId) {
            console.log("Missing userId in request params");
            throw new AppError("Missing userId", 400);
        }

        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }

        const user = await restoreUser({ userId, currentUser: req.user! });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id as string;
        if (!userId) {
            console.log("Missing userId in request params");
            throw new AppError("Missing userId", 400);
        }

        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }

        const user = await hardDeleteUser({ userId, currentUser: req.user! });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}



