import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User, { Role } from  "./user.model";
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

