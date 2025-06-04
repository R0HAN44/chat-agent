import mongoose, { Schema, Document } from 'mongoose';

export interface IAgent extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    aimodel: 'gpt-4' | 'claude-3' | 'custom';
    systemPrompt: string;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const AgentSchema = new Schema<IAgent>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        aimodel: {
            type: String,
            enum: ['gpt-4', 'claude-3', 'custom'],
            required: true,
        },
        systemPrompt: { type: String, required: true },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    { timestamps: true }
);

export default mongoose.model<IAgent>('Agent', AgentSchema);
