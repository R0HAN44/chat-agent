import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  userId: mongoose.Types.ObjectId;
  agentId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
  name: String,
  email: String,
  phone: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ILead>('Lead', LeadSchema);
