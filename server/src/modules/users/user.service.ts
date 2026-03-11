import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User, { Role } from "./user.model";
import Tenant from "../tenants/tenants.model";
import { AppError } from "../../core/middleware/error.middleware";

interface CreateUserInterface {
    name: string;
    email: string;
    password: string;
    role: Role;
    tenantId: string;
    registrarTenantId: string;
    registrarRole: string;
}

export const CreateUser = async (userData: CreateUserInterface) => {
    const { name, email, password, role, tenantId, registrarTenantId, registrarRole } = userData;
    if(registrarRole !== Role.SUPER_ADMIN && registrarRole !== Role.TENANT_ADMIN) {
        throw new AppError("You are not authorized to create users", 401);
    }

    if (registrarRole === Role.TENANT_ADMIN && tenantId !== registrarTenantId) {
        throw new AppError("You cannot create users for another tenant", 403);
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
        throw new AppError("Tenant not found", 404);
    }
    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) {
        throw new AppError("User with this email already exists in the tenant", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        tenantId,
    });

    return await user;
}

interface GetAllUsersServices {
    user: {
        tenantId: string;
        role: string;
    }
}

export const getAllUsersService = async ({ user }: GetAllUsersServices) => {
    if (user.role !== Role.SUPER_ADMIN && user.role !== Role.TENANT_ADMIN) {
        throw new AppError("You are not authorized to view users", 401);
    }
    
    const users = await User.find({ tenantId: user.tenantId }).select("-password");
    return users;
}

interface GetUserByIdInterface {
    userId: string;
    currentUser: {
        tenantId: string;
        role: string;
    }
}

export const getUserByIdService = async ({ userId, currentUser }: GetUserByIdInterface) => {
    if (currentUser.role !== Role.SUPER_ADMIN && currentUser.role !== Role.TENANT_ADMIN) {
        throw new AppError("You are not authorized to view users", 401);
    }

    const user = await User.findOne({ _id: userId, tenantId: currentUser.tenantId }).select("-password");
    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
}

interface SoftDeleteUserInterface {
    userId: string;
    currentUser: {
        userId: string;
        tenantId: string;
        role: string;
    }
}

export const softDeleteUser = async ({ userId, currentUser }: SoftDeleteUserInterface) => {
    const user = await User.findOne({
        _id: userId,
        tenantId: currentUser.tenantId,
        isActive: true
    })

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.role === Role.SUPER_ADMIN) {
        throw new AppError("Not allowed to delete SUPER_ADMIN", 403);
    }

    if (
        currentUser.role !== Role.SUPER_ADMIN &&
        currentUser.role !== Role.TENANT_ADMIN
    ) {
        throw new AppError("You are not authorized to delete users", 401);
    }

    if (
        currentUser.role === Role.TENANT_ADMIN &&
        user.tenantId.toString() !== currentUser.tenantId.toString()
    ) {
        throw new AppError("Cannot delete user from another tenant", 403);
    }

    if (user.role === Role.TENANT_ADMIN) {
        const adminCount = await User.countDocuments({
            tenantId: currentUser.tenantId,
            role: Role.TENANT_ADMIN,
            isActive: true
        });

        if (adminCount <= 1) {
            throw new AppError("Cannot delete the only TENANT_ADMIN in the tenant", 403);
        }
    }

    user.isActive = false;
    user.deletedAt = new Date();
    user.deletedBy = new mongoose.Types.ObjectId(currentUser.userId);
    await user.save();

    return user;
}


export  const restoreUser = async ({ userId, currentUser }: SoftDeleteUserInterface) => {
    const user = await User.findOne({
        _id: userId,
        tenantId: currentUser.tenantId,
        isActive: false
    })

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.role === Role.SUPER_ADMIN) {
        throw new AppError("Not allowed to restore SUPER_ADMIN", 403);
    }

    if (
        currentUser.role !== Role.SUPER_ADMIN &&
        currentUser.role !== Role.TENANT_ADMIN
    ) {
        throw new AppError("You are not authorized to restore users", 401);
    }

    if (
        currentUser.role === Role.TENANT_ADMIN &&
        user.tenantId.toString() !== currentUser.tenantId.toString()
    ) {
        throw new AppError("Cannot restore user from another tenant", 403);
    }

    user.isActive = true;
    user.deletedAt = null;
    user.deletedBy = null;
    await user.save();

    return user;
}

export const  hardDeleteUser = async ({ userId, currentUser }: SoftDeleteUserInterface) => {
    
    if (
        currentUser.role !== Role.SUPER_ADMIN
    ) {
        throw new AppError("You are not authorized to hard delete users", 401);
    }
    
    await User.findByIdAndDelete(userId);
    return { message: "User hard deleted successfully" };
    
}