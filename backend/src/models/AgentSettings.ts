import mongoose, { Document, Schema } from 'mongoose';

export interface IAgentSettings extends Document {
    agentId: mongoose.Types.ObjectId;
    general: {
        name: string;
        description: string;
        language: string;
    };
    ai: {
        model: string;
        temperature: number;
        systemPrompt: string;
    };
    chatInterface: {
        themeColor: string;
        welcomeMessage: string;
        position: 'left' | 'right';
    };
    leads: {
        enabled: boolean;
        fields: Array<{ label: string; type: string; required: boolean }>;
    };
    updatedAt: Date;
}

const AgentSettingsSchema = new Schema<IAgentSettings>({
    agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true, unique: true },
    general: {
        name: String,
        description: String,
        language: String,
    },
    ai: {
        model: String,
        temperature: Number,
        systemPrompt: String,
    },
    chatInterface: {
        themeColor: String,
        welcomeMessage: String,
        position: { type: String, enum: ['left', 'right'], default: 'right' },
    },
    leads: {
        enabled: { type: Boolean, default: false },
        fields: [
            {
                label: String,
                type: String,
                required: Boolean,
            },
        ],
    },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAgentSettings>('AgentSettings', AgentSettingsSchema);
