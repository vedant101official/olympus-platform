import { Router } from "express";
import { chatWithAI} from "./ai.controller";
import { authMiddleware } from "../../core/middleware/auth.middleware";

const router  = Router();

router.post("/chat", authMiddleware, chatWithAI);

export default router;

