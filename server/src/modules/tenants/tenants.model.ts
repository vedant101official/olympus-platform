import mongoose, { Schema, Document } from "mongoose";

export interface ITenant extends Document {
    name: string;
    slug: string;
    isActive: boolean;
}

const TenantSchema: Schema = new Schema<ITenant>(
    {
        name: { type: String, required: true , trim: true},
        slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<ITenant>("Tenant", TenantSchema);