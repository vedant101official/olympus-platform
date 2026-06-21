import { io } from "../../server";
import { ChatRoom } from "../../modules/chat/chatRoom.model";
import { Socket } from "socket.io";
import { checkChatAccess } from "../../modules/chat/chat.utils";
import { socketAuthMiddleware } from "./socketAuth";
import { Message } from "../../modules/chat/message.model";

export const initSocket = () => {
    io.use(socketAuthMiddleware);
    io.on("connection", (Socket)=> {
        console.log("user Connected:", Socket.id);
        Socket.on("joinRoom", async({ roomId })=>{
            const user = Socket.data.user
            await checkChatAccess(roomId, user);
            const room = await ChatRoom.findById(roomId);
            if(!room) {
                return Socket.emit("error", "room not found");
            }

            const isParticipant = room.participants.some(
                (id: any) => id.toString() === user.id
            );

            if(!isParticipant) {
                return Socket.emit("error","Unauthorized to join this room")
            }

            Socket.join(roomId);

            await Message.updateMany (
                {
                    ChatRoomId: roomId,
                    deliveredTo: { $ne :user.userId }
                },
                {
                    $addToSet : { deliveredTo : user.userId }
                }
            )

            Socket.to(roomId).emit("messageSeen",{
                userId:user.userId
            });
            
            console.log(`user ${user.id} joined room ${roomId}`);

        })
        Socket.on("sendMessage", async({roomId, message}) => {
            io.to(roomId).emit("Recive Message", message);
        });
        Socket.on("disconnect", () => {
            console.log("user disconnected", Socket.id);
        });
        
        Socket.on("typing",({roomId, user})=>{
            Socket.to(roomId).emit("typing",{
                userId: user.id,
                name: user.name,   
            })
        })

        Socket.on("stopTyping",({roomId, user})=>{
            Socket.to(roomId).emit("stopTyping",{
                userId: user.id 
            })
        })

        Socket.on("callUser",({ roomId, offer})=>{
            const user = Socket.data.user;
            Socket.to(roomId).emit("incommingCall", {
                from: user.userId,
                offer
            });
        });

        Socket.on("answereCall",({ roomId, answer })=>{
            const user = Socket.data.user;
            Socket.to(roomId).emit("callAnswered",{
                from: user.userId,
                answer
            });
        });

        Socket.on("iceCandidate",({roomId, candidate})=>{
            Socket.to(roomId).emit("iceCandidate",{
                candidate
            });
        });

    })
}