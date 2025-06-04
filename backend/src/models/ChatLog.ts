import mongoose, { Schema, Document } from 'mongoose';

export interface IChatLog extends Document {
  userId: mongoose.Types.ObjectId;
  agentId: mongoose.Types.ObjectId;
  prompt: string;
  response: string;
  createdAt: Date;
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'], default: 'neutral' };
  keywords: [String];
}

const ChatLogSchema = new Schema<IChatLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
  prompt: { type: String, required: true },
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'], default: 'neutral' },
  keywords: [{ type: String }],
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IChatLog>('ChatLog', ChatLogSchema);
