import { ChatRoom } from "./chatRoom.model";
import { Message } from "./message.model";
import { AppError } from "../../core/middleware/error.middleware";


interface CreateChatRoom {
    data : {
        name: string;
        type: 'PRIVATE' | 'GROUP';
        participants: string[]; 
    }
    currentUser: {
        tenantId: string;
        userId: string;
    }
}

export const createChatRoom = async ({data, currentUser}: CreateChatRoom ) => {

    console.log("Creating chat room with data:", data, "for user:", currentUser);

    if (data.type === "PRIVATE" && data.participants.length !== 1) {
        throw new AppError("Private chat rooms must have exactly one participant", 400);
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
    
    const message = await Message.create({
        chatRoomId: data.chatRoomId,
        senderId: currentUser.userId,
        content: data.content,
        type: data.type || "TEXT"
    })
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