import mongoose, { mongo } from "mongoose";
import { ref } from "node:process";

const MessageSchema = new mongoose.Schema(
    {
        chatRoomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatRoom",
            required: true
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["TEXT", "FILE", "IMAGE"],
            default: "TEXT"
        },
        deliveredTo:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        seenBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    { timestamps: true }
);

export const Message = mongoose.model("Message", MessageSchema);