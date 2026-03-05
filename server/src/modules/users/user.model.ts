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
    deletedAt: Date | null;
    deletedBy: mongoose.Types.ObjectId | null;
}

const userSchema: Schema = new Schema<UserDocument>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(Role), required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, {
    timestamps: true,
});

userSchema.index({ email: 1, tenantId: 1 }, { unique: true });
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model<UserDocument>("User", userSchema);