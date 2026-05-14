import { ChatRoom } from "./chatRoom.model";
import { Message } from "./message.model";
import { AppError } from "../../core/middleware/error.middleware";
import { io } from "../../server";
import mongoose, { StringQueryTypeCasting } from "mongoose";
import { checkChatAccess } from "./chat.utils";

interface CreateChatRoom {
    data: {
        name: string;
        type: 'PRIVATE' | 'GROUP';
        participants: string[];
    }
    currentUser: {
        tenantId: string;
        userId: string;
    }
}

export const createChatRoom = async ({ data, currentUser }: CreateChatRoom) => {

    console.log("Creating chat room with data:", data, "for user:", currentUser);

    if (data.type === "PRIVATE") {
        if (data.participants.length !== 1) {
            throw new AppError("Private chat rooms must have exactly one participant", 400);
        }
        const otherUserId = data.participants[0];

        const existingRoom = await ChatRoom.findOne({
            type: "PRIVATE",
            tenantId: currentUser.tenantId,
            participants: {
                $all: [currentUser.userId, otherUserId],
                $size: 2
            }
        })

        if (existingRoom) {
            return existingRoom;
        }
        const room = await ChatRoom.create({
            name: "Private Chat",
            type: "PRIVATE",
            tenantId: currentUser.tenantId,
            createdBy: currentUser.userId,
            participants: [currentUser.userId, otherUserId]
        })
        return room;
    }


    const room = await ChatRoom.create({
        name: data.name,
        type: data.type,
        tenantId: currentUser.tenantId,
        createdBy: currentUser.userId,
        participants: data.participants
    });
    return room;
}

interface GetUserChatRooms {
    tenantId: string;
    userId: string;
}

export const getUserChatRooms = async ({ tenantId, userId }: GetUserChatRooms) => {

    const rooms = await ChatRoom.find({
        tenantId,
        participants: userId
    }).populate("participants", "name email");
    if (!rooms) {
        throw new AppError("No chat rooms found for user", 404);
    }
    return rooms;
}

interface sendMessage {
    data: {
        fileName: string | null | undefined;
        fileSize: number | null | undefined;
        fileUrl: string | null | undefined;
        chatRoomId: string;
        content: string;
        type: "TEXT" | "FILE" | "IMAGE";
    }
    currentUser: {
        tenantId: string;
        userId: string;
    }
}

export const sendMessage = async ({ data, currentUser }: sendMessage) => {
    const rooms = await ChatRoom.findOne({
        _id: data.chatRoomId,
        tenantId: currentUser.tenantId,
        participants: currentUser.userId
    });

    if (!rooms) {
        throw new AppError("Chat room not found or user not a participant", 404);
    }

    if (rooms.tenantId.toString() !== currentUser.tenantId) {
        throw new AppError("Unauthorized to send message in this room", 403);
    }

    const isParticipant = rooms.participants.some(
        (id: any) => id.toString() === currentUser.userId
    );

    if (!isParticipant) {
        throw new AppError("Unauthorized to send message in this room", 403);
    }

    const message = await Message.create({
        chatRoomId: data.chatRoomId,
        senderId: currentUser.userId,
        content: data.content,
        type: data.type || "TEXT",
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        deliveredTo: [currentUser.userId],
        seenBy: [currentUser.userId]
    });

    io.to(data.chatRoomId.toString()).emit("receiveMessage", message);
    return message;
}

interface getChatRoomMessages {
    chatRoomId: string;
    tenantId: string;
    userId: string;
}

export const getChatRoomMessages = async ({ chatRoomId, tenantId, userId }: getChatRoomMessages) => {

    const room = await ChatRoom.findOne({
        _id: chatRoomId,
        tenantId,
        participants: userId
    });

    if (!room) {
        throw new AppError("Chat room not found or user not a participant", 404);
    }

    const messages = await Message.find({ chatRoomId }).populate("senderId", "name email").sort({ createdAt: 1 });
    return messages;
}

export const getMessages = async (
    roomId: string,
    currentUser: any,
    cursor?: string,
    limit: number = 20
) => {
    const room = await checkChatAccess(roomId, currentUser);

    const query: any = {
        chatRoomId: roomId
    };
    if (cursor) {
        if (!mongoose.Types.ObjectId.isValid(cursor)) {
            throw new AppError("Invalade cursor", 400);
        }

        query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }
    const message = await Message.find(query)
        .sort({ _id: -1 })
        .limit(limit)
        .populate("senderId", "name email");

    return message.reverse();
}
