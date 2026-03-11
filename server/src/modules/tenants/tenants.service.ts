import Tenant from "./tenants.model";
import { AppError } from "../../core/middleware/error.middleware";
interface CreateTenantInput {
    name: string;
    slug: string;
    isActive?: boolean;
    currentUser: {
        role: string;
    }
}

export const createTenant = async (data: CreateTenantInput) => {
    if (data.currentUser.role !== "SUPER_ADMIN") {
        throw new AppError("You are not authorized to create tenants", 401);
    }
    const existingTenant = await Tenant.findOne({ slug: data.slug });
    if (existingTenant) {
        throw new AppError("Tenant with this slug already exists", 409);
    }
    const tenant = await Tenant.create(data);
    return tenant
};