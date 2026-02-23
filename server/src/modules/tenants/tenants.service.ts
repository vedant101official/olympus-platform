import Tenant from "./tenants.model";
interface CreateTenantInput {
    name: string;
    slug: string;
    isActive?: boolean;
}

export const createTenant = async (data: CreateTenantInput) => {
    const existingTenant = await Tenant.findOne({ slug: data.slug });
    if (existingTenant) {
        throw new Error("Tenant with this slug already exists");
    }
    const tenant = await Tenant.create(data);
    return tenant
};