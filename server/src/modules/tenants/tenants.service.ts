import Tenant from "./tenants.model";
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
        throw new Error("You are not authorized to create tenants");
    }
    const existingTenant = await Tenant.findOne({ slug: data.slug });
    if (existingTenant) {
        throw new Error("Tenant with this slug already exists");
    }
    const tenant = await Tenant.create(data);
    return tenant
};