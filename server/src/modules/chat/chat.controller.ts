import { Request, Response, NextFunction } from 'express';
import { AppError } from "../../core/middleware/error.middleware";

import * as chatService from "./chat.service";

export const createChatRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new AppError("User information missing", 400);
        }
        const { tenantId, userId } = req.user;
        const room = await chatService.createChatRoom({ data: req.body, currentUser: { tenantId, userId } });
        res.status(201).json({
            success: true,
            data : room,
            message : "Chat room created successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getUserChatRooms = async (req : Request, res: Response, next: NextFunction) => {
    try {
        if(!req.user) {
            throw new AppError("User information missing", 400);
        }
        const rooms = await chatService.getUserChatRooms({ tenantId: req.user.tenantId, userId: req.user.userId });
        res.status(200).json({
            success: true,
            data: rooms
        });
    }
    catch (error) {
        next(error);
    }
}


export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new AppError("User information missing", 400);
        }
        const { tenantId, userId } = req.user;
        const message = await chatService.sendMessage({ data: req.body, currentUser: { tenantId, userId } });
        res.status(201).json({
            success: true,
            data : message,
            message : "Message sent successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getChatRoomMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new AppError("User information missing", 400);
        }
        const { tenantId, userId } = req.user;
        const messages = await chatService.getChatRoomMessages({ chatRoomId: req.params.roomId as string, tenantId, userId });
        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        next(error);
    }
}