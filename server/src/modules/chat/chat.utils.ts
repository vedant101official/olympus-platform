import { ChatRoom } from "./chatRoom.model";
import { AppError } from "../../core/middleware/error.middleware";

export const checkChatAccess = async (roomId:string, currentUser:any) => {
    const room = await ChatRoom.findById(roomId);

    if(!room){
        throw new AppError("Chat room not found", 404);
    }

    if(room.tenantId.toString() !== currentUser.tenantId){
        throw new AppError("Unauthorized to access this chat room", 403);
    }

    const isParticipant = room.participants.some(
        (id:any) => id.toString() === currentUser.userId
    );

    if(!isParticipant){
        throw new AppError( "Unauthorized to access this chat room", 403);
    }

    return room;

}