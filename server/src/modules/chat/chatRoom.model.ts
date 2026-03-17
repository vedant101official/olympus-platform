import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        type:{
            type: String,
            enum: ["PRIVATE", "GROUP"],
            default: "PRIVATE"
        },
        tenantId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tenant",
            required: true
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        participants:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ]
    },
    { timestamps: true }
);

export const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);