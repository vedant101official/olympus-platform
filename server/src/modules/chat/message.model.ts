import mongoose from "mongoose";

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
        }
    },
    { timestamps: true }
);

export const Message = mongoose.model("Message", MessageSchema);