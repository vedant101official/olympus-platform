import { Router } from "express";
import { registerUser, deactivateUser, activateUser, deleteUser, getAllUsers, getUserById } from "./user.controller";
import { authMiddleware } from "../../core/middleware/auth.middleware";
import { allowRoles } from "../../core/middleware/role.middleware";
import { Role } from "./user.model";

const router = Router();


router.get("/all", authMiddleware, allowRoles(Role.SUPER_ADMIN, Role.TENANT_ADMIN), getAllUsers);
router.get("/:id", authMiddleware, allowRoles(Role.SUPER_ADMIN, Role.TENANT_ADMIN), getUserById);
router.post("/register", registerUser);
router.patch("/:id/deactivate", authMiddleware, allowRoles(Role.SUPER_ADMIN, Role.TENANT_ADMIN), deactivateUser);
router.patch("/:id/activate", authMiddleware, allowRoles(Role.SUPER_ADMIN, Role.TENANT_ADMIN), activateUser);
router.delete("/:id", authMiddleware, allowRoles(Role.SUPER_ADMIN), deleteUser);

export default router;