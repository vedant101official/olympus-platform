import { Router } from "express";
import { registerTenant } from "./tenants.controller";

const router = Router();

router.post("/register", registerTenant);

export default router;