import { Router } from "express";
import { uploadDocument } from "./document.controller";
import { authMiddleware } from "../../core/middleware/auth.middleware";
import { upload } from "../../core/middleware/upload.middleware";

const router = Router();

router.post(
    "/upload",
    authMiddleware,
    upload.single("file"),
    uploadDocument
);

export default router;