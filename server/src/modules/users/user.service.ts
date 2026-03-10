import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User, { Role } from "./user.model";
import Tenant from "../tenants/tenants.model";

interface CreateUserInterface {
    name: string;
    email: string;
    password: string;
    role: Role;
    tenantId: string;
}

export const CreateUser = async (userData: CreateUserInterface) => {
    const { name, email, password, role, tenantId } = userData;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
        throw new Error("Tenant not found");
    }
    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) {
        throw new Error("User with this email already exists in the tenant");
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
    console.log("Getting all users for tenant:", user.tenantId, "with role:", user.role);
    if (user.role !== Role.SUPER_ADMIN && user.role !== Role.TENANT_ADMIN) {
        throw new Error("You are not authorized to view users");
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
        throw new Error("You are not authorized to view users");
    }

    const user = await User.findOne({ _id: userId, tenantId: currentUser.tenantId }).select("-password");
    if (!user) {
        throw new Error("User not found");
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
        throw new Error("User not found");
    }

    if (user.role === Role.SUPER_ADMIN) {
        throw new Error("Not allowed to delete SUPER_ADMIN");
    }

    if (
        currentUser.role !== Role.SUPER_ADMIN &&
        currentUser.role !== Role.TENANT_ADMIN
    ) {
        throw new Error("You are not authorized to delete users");
    }

    if (
        currentUser.role === Role.TENANT_ADMIN &&
        user.tenantId.toString() !== currentUser.tenantId.toString()
    ) {
        throw new Error("Cannot delete user from another tenant");
    }

    if (user.role === Role.TENANT_ADMIN) {
        const adminCount = await User.countDocuments({
            tenantId: currentUser.tenantId,
            role: Role.TENANT_ADMIN,
            isActive: true
        });

        if (adminCount <= 1) {
            throw new Error("Cannot delete the only TENANT_ADMIN in the tenant");
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
        throw new Error("User not found");
    }

    if (user.role === Role.SUPER_ADMIN) {
        throw new Error("Not allowed to restore SUPER_ADMIN");
    }

    if (
        currentUser.role !== Role.SUPER_ADMIN &&
        currentUser.role !== Role.TENANT_ADMIN
    ) {
        throw new Error("You are not authorized to restore users");
    }

    if (
        currentUser.role === Role.TENANT_ADMIN &&
        user.tenantId.toString() !== currentUser.tenantId.toString()
    ) {
        throw new Error("Cannot restore user from another tenant");
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
        throw new Error("You are not authorized to hard delete users");
    }
    
    await User.findByIdAndDelete(userId);
    return { message: "User hard deleted successfully" };
    
}