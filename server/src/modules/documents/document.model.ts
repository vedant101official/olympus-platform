import mongoose, { Schema, Document } from "mongoose";

export interface DocumentChunk extends Document {
    tenantId: mongoose.Types.ObjectId;
    fileName: string;
    chunkIndex: number;
    content: string;
}

const documentSchema = new Schema<DocumentChunk>(
{
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        required: true
    },

    fileName: {
        type: String,
        required: true
    },

    chunkIndex: {
        type: Number,
        required: true
    },

    content: {
        type: String,
        required: true
    }

},
{
    timestamps:true
});

export default mongoose.model<DocumentChunk>(
    "DocumentChunk",
    documentSchema
);