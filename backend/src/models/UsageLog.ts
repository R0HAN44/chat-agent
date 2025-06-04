import mongoose, { Schema, Document } from 'mongoose';

export interface IUsageLog extends Document {
  userId: mongoose.Types.ObjectId;
  agentId: mongoose.Types.ObjectId;
  prompt: string;
  response: string;
  promptTokens: number;
  responseTokens: number;
  totalTokens: number;
  createdAt: Date;
}

const UsageLogSchema = new Schema<IUsageLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
  prompt: { type: String },
  response: { type: String },
  promptTokens: { type: Number, default: 0 },
  responseTokens: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUsageLog>('UsageLog', UsageLogSchema);
