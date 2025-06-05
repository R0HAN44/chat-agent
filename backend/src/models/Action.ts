import mongoose, { Document, Schema } from 'mongoose';

export type ActionType = 'custom' | 'button' | 'web_search' | 'collect_leads';

export interface IAction extends Document {
    agentId: mongoose.Types.ObjectId;
    name: string;
    type: ActionType;
    payload: Record<string, any>;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
}

const actionSchema = new Schema<IAction>({
    agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['custom', 'button', 'web_search', 'collect_leads'],
        required: true
    },
    payload: { type: Schema.Types.Mixed, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAction>('Action', actionSchema);
