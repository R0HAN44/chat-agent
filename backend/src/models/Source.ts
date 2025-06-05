import mongoose, { Document, Schema } from "mongoose";

export type SourceType = "document" | "text" | "qna" | "website";

export interface ISource extends Document {
    userId: mongoose.Types.ObjectId;
    agentId: mongoose.Types.ObjectId;
    type: SourceType;
    title: string;
    content?: string;
    fileUrl?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}

const SourceSchema = new Schema<ISource>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
    type: { type: String, enum: ['document', 'text', 'qna', 'website'], required: true },
    title: { type: String, required: true },
    content: { type: String }, // for text, qna
    fileUrl: { type: String }, // for uploaded documents
    metadata: { type: Object }, // e.g., filename, page count, crawl status
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISource>('Source', SourceSchema);