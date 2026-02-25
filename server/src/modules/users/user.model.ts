import mongoose, { Schema, Document } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    TENANT_ADMIN = "TENANT_ADMIN",
    TEACHER_USER = "TEACHER_USER",
    STUDENT_USER = "STUDENT_USER",
}

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    role: Role;
    tenantId: mongoose.Types.ObjectId;
    isActive: boolean;
}

const userSchema: Schema = new Schema<UserDocument>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(Role), required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});

userSchema.index({ email: 1, tenant: 1 }, { unique: true });
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model<UserDocument>("User", userSchema);