import { Router } from "express";
import {
  createChatRoom,
  getChatRoomMessages,
  getUserChatRooms,
  sendMessage,
} from "./chat.controller";
import { authMiddleware } from "../../core/middleware/auth.middleware";

const router = Router();

router.post("/rooms", authMiddleware, createChatRoom);
router.get("/rooms", authMiddleware, getUserChatRooms);
router.post("/messages", authMiddleware, sendMessage);
router.get("/rooms/:roomId/messages", authMiddleware, getChatRoomMessages);

export default router;
