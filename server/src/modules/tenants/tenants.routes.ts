import { Router } from "express";
import { registerTenant } from "./tenants.controller";
import { authMiddleware } from "../../core/middleware/auth.middleware";
import { allowRoles } from "../../core/middleware/role.middleware";
import { Role } from "./tenants.model";

const router = Router();

router.post("/register", authMiddleware ,allowRoles(Role.SUPER_ADMIN), registerTenant);

export default router;